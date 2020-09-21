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
	path := "/pipelines"
	manager := managerMain.NewManager()
	controller := PipelineAPI{manager}

	api.v2.POST(path, controller.executeV2Deployment)
}

func (api *PipelineAPI) CreateOrUpdatePipeline(ctx *gin.Context) {
	var deprecatedPipeline pipeline.NonAdjustablePipeline
	ctx.Bind(&deprecatedPipeline)

	pipeline := deprecatedPipeline.ToPipeline()
	api.manager.Start(pipeline)

	ctx.JSON(204, nil)
}

func (api *PipelineAPI) executeV2Deployment(ctx *gin.Context) {
	var v2Pipeline pipeline.V2Pipeline
	ctx.Bind(&v2Pipeline)

	api.manager.executeV2Deployment(v2Pipeline)

	ctx.JSON(204, nil)
}
