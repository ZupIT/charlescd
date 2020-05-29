/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

	apiMain := api.NewAPI()
	apiMain.NewExecutionAPI(executionMain)
	apiMain.NewPipelineAPI(mozartMain)
	apiMain.Start()
}
