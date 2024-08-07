package main

import (
	"context"
	"errors"
	"fmt"
	env "github.com/cassioHilario/rocketseat-go-react-na-pratica/cmd/tools/utils"
	"github.com/cassioHilario/rocketseat-go-react-na-pratica/internal/api"
	"github.com/cassioHilario/rocketseat-go-react-na-pratica/internal/store/pgstore"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
	"os"
	"os/signal"
)

func main() {

	envInstance := env.GetInstance()
	dbConfig := envInstance.GetDBConfig()

	ctx := context.Background()

	pool, err := pgxpool.New(ctx, fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%d",
		dbConfig.Username, dbConfig.Password, dbConfig.Name, dbConfig.Host, dbConfig.Port,
	))

	if err != nil {
		panic(err)
	}

	defer pool.Close()

	handler := api.NewHandler(pgstore.New(pool))

	go func() {
		if err := http.ListenAndServe(":8080", handler); err != nil {
			if !errors.Is(err, http.ErrServerClosed) {
				panic(err)
			}
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	<-quit

}
