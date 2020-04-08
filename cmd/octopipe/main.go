package main

import (
	"github.com/joho/godotenv"
	"log"
	"octopipe/pkg/api"
	"octopipe/pkg/connection"
	"octopipe/pkg/execution"
	"octopipe/pkg/mozart"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	db, err := connection.NewDatabaseConnection()
	if err != nil {
		log.Fatal(err)
		return
	}

	executionMain := execution.NewExecutionManager(db)
	mozart := mozart.NewMozart(executionMain)

	api := api.NewApi()
	api.NewExeuctionApi(executionMain)
	api.NewPipelineApi(mozart)
	api.Start()
}
