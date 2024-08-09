package env

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Env struct {
	db    DBConfig
	api   APIConfig
	other OtherConfig
}

type DBConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Name     string
}

type APIConfig struct {
	URL    string
	Key    string
	Secret string
}

type OtherConfig struct {
	SomeVar  string
	OtherVar int
}

var instance *Env

func GetInstance() *Env {
	if instance == nil {
		instance = &Env{}
		err := instance.load()
		if err != nil {
			log.Fatal(err)
		}
	}
	return instance
}

func (e *Env) load() error {
	err := godotenv.Load()
	if err != nil {
		return err
	}

	e.db.Host = os.Getenv("GO_DATABASE_HOST")
	e.db.Port, _ = strconv.Atoi(os.Getenv("GO_DATABASE_PORT"))
	e.db.Username = os.Getenv("GO_DATABASE_USER")
	e.db.Password = os.Getenv("GO_DATABASE_PASS")
	e.db.Name = os.Getenv("GO_DATABASE_NAME")

	//e.api.URL = os.Getenv("API_URL")
	//e.api.Key = os.Getenv("API_KEY")
	//e.api.Secret = os.Getenv("API_SECRET")

	//e.other.SomeVar = os.Getenv("SOME_VAR")
	//e.other.OtherVar, _ = strconv.Atoi(os.Getenv("OTHER_VAR"))

	return nil
}

func (e *Env) GetDBConfig() DBConfig {
	return e.db
}

func (e *Env) GetAPIConfig() APIConfig {
	return e.api
}

func (e *Env) GetOtherConfig() OtherConfig {
	return e.other
}
