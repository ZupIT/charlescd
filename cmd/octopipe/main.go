package main

import (
	"log"
	"octopipe/pkg/api"
	"octopipe/pkg/connection"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/mozart"
	"os"

	_ "github.com/jinzhu/gorm/dialects/postgres"
	"k8s.io/client-go/dynamic"
)

func main() {
	db, err := connection.NewDatabaseConnection()
	if err != nil {
		log.Fatal(err)
		return
	}

	var dynamicK8sClient dynamic.Interface
	if os.Getenv("KUBECONFIG") == connection.KubeconfigInCluster {
		dynamicK8sClient, err = connection.NewDynamicK8sClientInCluster()
	} else {
		dynamicK8sClient, err = connection.NewDynamicK8sClientOutCluster()
	}

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
