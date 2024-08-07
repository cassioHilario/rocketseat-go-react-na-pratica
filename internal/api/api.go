package api

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/cassioHilario/rocketseat-go-react-na-pratica/internal/store/pgstore"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5"
	"log/slog"
	"net/http"
	"sync"
)

type apiHandler struct {
	q           *pgstore.Queries
	r           *chi.Mux
	upgrader    websocket.Upgrader
	subscribers map[string]map[*websocket.Conn]context.CancelFunc
	mu          *sync.Mutex
}

func (h apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.r.ServeHTTP(w, r)
}

func NewHandler(q *pgstore.Queries) http.Handler {
	a := apiHandler{
		q:           q,
		upgrader:    websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }},
		subscribers: make(map[string]map[*websocket.Conn]context.CancelFunc),
		mu:          &sync.Mutex{},
	}
	r := chi.NewRouter()

	r.Use(middleware.RequestID, middleware.Recoverer, middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/subscribe/{room_id}", a.handleSubscribe)

	r.Route("/api", func(r chi.Router) {
		r.Route("/rooms", func(r chi.Router) {
			r.Post("/", a.handleCreateRoom)
			r.Get("/", a.handleGetRooms)

			r.Route("/{roomID}/messages", func(r chi.Router) {
				r.Post("/", a.handleCreateRoomMessage)
				r.Get("/", a.handleGetRoomMessages)

				r.Route("/{messageID}", func(r chi.Router) {
					r.Get("/", a.handleGetRoomMessage)
					r.Patch("/react", a.handleReactToMessage)
					r.Delete("/react", a.handleRemoveReactFromMessage)
					r.Patch("/answer", a.handleMarkMessageAsAnswered)
				})
			})
		})
	})

	a.r = r
	return a
}

const (
	MessageKindMessageCreated = "message_created"
)

type MessageMessageCreated struct {
	ID      string `json:"id"`
	Message string `json:"message"`
}

type Message struct {
	Kind   string                `json:"kind"`
	Value  MessageMessageCreated `json:"value"`
	RoomID string                `json:"-"`
}

func (h apiHandler) isRoomIdValid(w http.ResponseWriter, r *http.Request, rawRoomID string) (uuid.UUID, bool) {
	roomID, err := uuid.Parse(rawRoomID)
	if err != nil {
		http.Error(w, "Invalid Room ID", http.StatusBadRequest)
		return uuid.Nil, false
	}

	_, err = h.q.GetRoom(r.Context(), roomID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "Room Not Found", http.StatusBadRequest)
			return uuid.Nil, false
		}
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return uuid.Nil, false
	}
	return roomID, true
}

func (h apiHandler) notifyClients(msg Message) {
	h.mu.Lock()
	defer h.mu.Unlock()

	subscribers, ok := h.subscribers[msg.RoomID]
	if !ok || len(subscribers) == 0 {
		return
	}

	for conn, cancel := range subscribers {
		if err := conn.WriteJSON(msg); err != nil {
			slog.Error("Failed to send message to client", "error", err)
			cancel()
		}
	}
}

func (h apiHandler) handleSubscribe(w http.ResponseWriter, r *http.Request) {
	rawRoomID := chi.URLParam(r, "room_id")

	_, isRoomIdValid := h.isRoomIdValid(w, r, rawRoomID)

	if !isRoomIdValid {
		return
	}

	c, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		slog.Warn("Failed to upgrade connection to websocket", "error", err)
		http.Error(w, "Failed to upgrade connection to websocket", http.StatusBadRequest)
		return
	}

	defer func(c *websocket.Conn) {
		err := c.Close()
		if err != nil {
			panic(err)
		}
	}(c)

	ctx, cancel := context.WithCancel(r.Context())

	h.mu.Lock()

	if _, ok := h.subscribers[rawRoomID]; !ok {
		h.subscribers[rawRoomID] = make(map[*websocket.Conn]context.CancelFunc)
	}
	slog.Info("new subscriber connected", "roomID", rawRoomID, "clientIp", r.RemoteAddr)
	h.subscribers[rawRoomID][c] = cancel

	h.mu.Unlock()
	<-ctx.Done()
	h.mu.Lock()
	delete(h.subscribers[rawRoomID], c)
	h.mu.Unlock()

}

func (h apiHandler) handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	type _body struct {
		Theme string `json:"theme"`
	}
	var body _body

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	roomID, err := h.q.InsertRoom(r.Context(), body.Theme)
	if err != nil {
		slog.Error("Failed to insert room", "error", err)
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	type response struct {
		ID string `json:"id"`
	}

	data, err := json.Marshal(response{ID: roomID.String()})
	if err != nil {
		slog.Error("Failed to marshal response", "error", err)
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(data)
	if err != nil {
		slog.Error("Failed to write response", "error", err)
		http.Error(w, "Error communicating with the Database", http.StatusServiceUnavailable)
		return
	}

}

func (h apiHandler) handleGetRooms(w http.ResponseWriter, r *http.Request) {

}

func (h apiHandler) handleCreateRoomMessage(w http.ResponseWriter, r *http.Request) {
	rawRoomID := chi.URLParam(r, "roomID")

	roomID, isRoomIdValid := h.isRoomIdValid(w, r, rawRoomID)
	if !isRoomIdValid {
		return
	}

	type _body struct {
		Message string `json:"message"`
	}
	var body _body
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	messageID, err := h.q.InsertMessage(r.Context(), pgstore.InsertMessageParams{RoomID: roomID, Message: body.Message})
	if err != nil {
		slog.Error("Failed to insert message to database", "error", err)
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	type response struct {
		ID string `json:"id"`
	}

	data, err := json.Marshal(response{ID: messageID.String()})
	if err != nil {
		slog.Error("Failed to marshal response", "error", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(data)
	if err != nil {
		slog.Error("Failed to write response", "error", err)
		http.Error(w, "Error communicating with the Database", http.StatusServiceUnavailable)
		return
	}

	go h.notifyClients(Message{
		Kind:   MessageKindMessageCreated,
		RoomID: rawRoomID,
		Value: MessageMessageCreated{
			ID:      messageID.String(),
			Message: body.Message,
		},
	})

}

func (h apiHandler) handleGetRoomMessages(w http.ResponseWriter, r *http.Request) {

}

func (h apiHandler) handleGetRoomMessage(w http.ResponseWriter, r *http.Request) {

}

func (h apiHandler) handleReactToMessage(w http.ResponseWriter, r *http.Request) {

}

func (h apiHandler) handleRemoveReactFromMessage(w http.ResponseWriter, r *http.Request) {

}

func (h apiHandler) handleMarkMessageAsAnswered(w http.ResponseWriter, r *http.Request) {

}
