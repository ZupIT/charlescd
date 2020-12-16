package main

import (
	"github.com/joho/godotenv"
	"hermes/internal/configuration"
	"hermes/internal/subscription"
	"hermes/web/api"
	"log"
)

func main() {
	godotenv.Load()

	db, err := configuration.GetDBConnection("migrations")
	if err != nil {
		log.Fatal(err)
	}

	subscriptionMain := subscription.NewMain(db)

	router := api.NewApi(subscriptionMain)
	api.Start(router)
}
