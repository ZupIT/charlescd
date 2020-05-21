package main

import (
	"log"
	"octopipe/pkg/api"
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/database"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/git"
	"octopipe/pkg/mozart"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/template"

	"github.com/joho/godotenv"

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
	templateMain := template.NewTemplateManager()
	gitMain := git.NewGitManager()
	deployerMain := deployer.NewDeployerManager()
	cloudproviderMain := cloudprovider.NewCloudproviderManager()
	_ = pipeline.NewPipelineManager(db)
	mozartMain := mozart.NewMozartManager(
		executionMain,
		templateMain,
		gitMain,
		deployerMain,
		cloudproviderMain,
	)

	apiMain := api.NewApi()
	apiMain.NewExeuctionApi(executionMain)
	apiMain.NewPipelineApi(mozartMain)
	apiMain.Start()
}
