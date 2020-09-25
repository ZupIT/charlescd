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

package api

import (
	"octopipe/pkg/manager"
	"octopipe/pkg/pipeline"

	"github.com/gin-gonic/gin"
)

type PipelineAPI struct {
	manager manager.UseCases
}

func (api *API) NewPipelineAPI(managerMain manager.MainUseCases) {
	path := "/pipelines"
	manager := managerMain.NewManager()
	controller := PipelineAPI{manager}

	api.v1.POST(path, controller.CreateOrUpdatePipeline)
}

func (api *API) NewV2PipelineAPI(managerMain manager.MainUseCases) {
	manager := managerMain.NewManager()
	controller := PipelineAPI{manager}

	api.v2.POST("/deployments", controller.executeV2Deployment)
	api.v2.POST("/undeployments", controller.executeV2Undeployment)
}

func (api *PipelineAPI) CreateOrUpdatePipeline(ctx *gin.Context) {
	var deprecatedPipeline pipeline.NonAdjustablePipeline
	ctx.Bind(&deprecatedPipeline)

	pipeline := deprecatedPipeline.ToPipeline()
	api.manager.ExecuteV1Pipeline(pipeline)

	ctx.JSON(204, nil)
}

func (api *PipelineAPI) executeV2Deployment(ctx *gin.Context) {
	var v2Pipeline  manager.V2DeploymentPipeline
	ctx.Bind(&v2Pipeline)
	incomingCircleId := ctx.GetHeader("x-circle-id")
	api.manager.ExecuteV2DeploymentPipeline(v2Pipeline, incomingCircleId)
	ctx.JSON(204, nil)
}

func (api *PipelineAPI) executeV2Undeployment(ctx *gin.Context) {
	var v2Pipeline manager.V2UndeploymentPipeline
	ctx.Bind(&v2Pipeline)
	incomingCircleId := ctx.GetHeader("x-circle-id")
	api.manager.ExecuteV2UndeploymentPipeline(v2Pipeline, incomingCircleId)
	ctx.JSON(204, nil)
}
