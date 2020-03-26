package main

import (
	"log"
	"octopipe/pkg/api"
	"octopipe/pkg/connection"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/mozart"
	"os"

	"github.com/joho/godotenv"

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

	k8sConnection, err := connection.NewK8sConnection(os.Getenv("KUBECONFIG"))
	if err != nil {
		log.Fatal(err)
		return
	}

	executionMain := execution.NewExecutionManager(db)
	deployer := deployer.NewDeployer(k8sConnection)
	mozart := mozart.NewMozart(deployer, executionMain)

	api := api.NewApi()
	api.NewExeuctionApi(executionMain)
	api.NewPipelineApi(mozart)
	api.Start()
}
