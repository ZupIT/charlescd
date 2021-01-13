package main

import (
	"github.com/joho/godotenv"
	"hermes/internal/configuration"
	"hermes/internal/publisher"
	"hermes/internal/subscription"
	"hermes/internal/subscriptionexecution"
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
	subscriptionExecution := subscriptionexecution.NewMain(db)
	publisherMain := publisher.NewMain(db)

	router := api.NewApi(subscriptionMain, subscriptionExecution, publisherMain)
	api.Start(router)
}
