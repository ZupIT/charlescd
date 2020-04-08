package main

import (
	"github.com/joho/godotenv"
	"log"
	"octopipe/pkg/api"
	"octopipe/pkg/database"
	"octopipe/pkg/execution"
	"octopipe/pkg/mozart"
	"octopipe/pkg/pipeline"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	db, err := database.NewDatabase()
	if err != nil {
		log.Fatal(err)
		return
	}

	executionMain := execution.NewExecutionManager(db)
	_ = pipeline.NewPipelineManager(db)
	mozartMain := mozart.NewMozart(executionMain)

	apiMain := api.NewApi()
	apiMain.NewExeuctionApi(executionMain)
	apiMain.NewPipelineApi(mozartMain)
	apiMain.Start()
}
