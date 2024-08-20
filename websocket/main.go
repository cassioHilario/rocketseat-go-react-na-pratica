package main

import (
 "github.com/cassioHilario/rocketseat-go-react-na-pratica/app/router"
 "github.com/cassioHilario/rocketseat-go-react-na-pratica/config"
 "github.com/joho/godotenv"
 "os"
)

func init() {
 godotenv.Load()
 config.InitLog()
}

func main() {
 port := os.Getenv("PORT")

 init := config.Init()
 app := router.Init(init)

 app.Run(":" + port)
}