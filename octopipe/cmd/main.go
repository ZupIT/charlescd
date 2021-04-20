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
	"github.com/argoproj/gitops-engine/pkg/utils/kube"
	"github.com/argoproj/gitops-engine/pkg/utils/tracing"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"k8s.io/klog/klogr"
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployment"
	"octopipe/pkg/log"
	"octopipe/pkg/manager"
	"octopipe/pkg/repository"
	"octopipe/pkg/template"
	"octopipe/web/api"
)

func main() {

	logrus.SetFormatter(&logrus.JSONFormatter{PrettyPrint: true})

	if err := godotenv.Load(); err != nil {
		logrus.Print("No .env file found")
	}

	kubectl := &kube.KubectlCmd{
		Log:    klogr.New(),
		Tracer: tracing.NopTracer{},
	}
	logs := &log.Aggregator{
		Logs: make([]log.Log, 0),
	}
	repositoryMain := repository.NewRepositoryMain()
	templateMain := template.NewTemplateMain(repositoryMain)
	cloudproviderMain := cloudprovider.NewCloudproviderMain()
	deploymentMain := deployment.NewDeploymentMain()
	managerMain := manager.NewManagerMain(kubectl, templateMain, deploymentMain, cloudproviderMain, repositoryMain, logs)

	apiServer := api.NewAPI()
	apiServer.NewPipelineAPI(managerMain)
	apiServer.NewV2PipelineAPI(managerMain)
	apiServer.Start()
}
