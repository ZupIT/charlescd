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
	"net/http"
	"octopipe/pkg/execution"
	"octopipe/pkg/utils"

	"github.com/gin-gonic/gin"
)

type ExecutionAPI struct {
	executionMain execution.ManagerUseCases
}

func (api *Api) NewExecutionAPI(executionMain execution.ManagerUseCases) {
	path := "/executions"

	executionAPI := ExecutionAPI{executionMain}
	api.v1.GET(path, executionAPI.findAll)
	api.v1.GET(path+"/:id", executionAPI.findByID)
}

func (executionAPI *ExecutionAPI) findAll(context *gin.Context) {
	executions, err := executionAPI.executionMain.FindAll()
	if err != nil {
		utils.CustomLog("error", "findAll", err.Error())
		return
	}

	context.JSON(200, executions)
}

func (executionAPI *ExecutionAPI) findByID(context *gin.Context) {
	id := context.Param("id")

	execution, err := executionAPI.executionMain.FindByID(id)
	if err != nil {
		utils.CustomLog("error", "findAll", err.Error())
		return
	}

	if execution == nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Execution not found"})
	} else {
		context.JSON(http.StatusOK, execution)
	}
}
