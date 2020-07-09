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
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployment"
	"octopipe/pkg/manager"
	"octopipe/pkg/repository"
	"octopipe/pkg/template"
	v1 "octopipe/web/api/v1"

	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	repositoryMain := repository.NewRepositoryMain()
	templateMain := template.NewTemplateMain(repositoryMain)
	cloudproviderMain := cloudprovider.NewCloudproviderMain()
	deploymentMain := deployment.NewDeploymentMain()
	managerMain := manager.NewManagerMain(templateMain, deploymentMain, cloudproviderMain, repositoryMain)

	api := v1.NewAPI()
	api.NewPipelineAPI(managerMain)
	api.Start()
}
