package api

import (
	"github.com/cassioHilario/rocketseat-go-react-na-pratica/internal/store/pgstore"
	"github.com/go-chi/chi/v5"
	"net/http"
)

type apiHandler struct {
	q *pgstore.Queries
	r *chi.Mux
}

func (h apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

}

func NewHandler(q *pgstore.Queries) http.Handler {

}
