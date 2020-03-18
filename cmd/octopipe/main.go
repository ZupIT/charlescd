package main

import (
	"log"
	"octopipe/pkg/api"
	"octopipe/pkg/connection"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/mozart"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	db, err := connection.NewDatabaseConnection()
	if err != nil {
		log.Fatal(err)
		return
	}

	dynamicK8sClient, err := connection.NewDynamicK8sClient()
	if err != nil {
		log.Fatal(err)
		return
	}

	executionMain := execution.NewExecutionManager(db)
	deployer := deployer.NewDeployer(dynamicK8sClient)
	mozart := mozart.NewMozart(deployer, executionMain)

	api := api.NewApi()
	api.NewExeuctionApi(executionMain)
	api.NewPipelineApi(mozart)
	api.Start()
}
