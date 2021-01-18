package main

import (
	"github.com/joho/godotenv"
	"hermes/internal/configuration"
	"hermes/internal/message"
	"hermes/internal/messageexecutionhistory"
	"hermes/internal/publisher"
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
	messageMain := message.NewMain(db)
	messageExecutionMain := messageexecutionhistory.NewMain(db)
	publisherMain := publisher.NewMain(db)

	router := api.NewApi(subscriptionMain, messageMain, messageExecutionMain, publisherMain)
	api.Start(router)
}
