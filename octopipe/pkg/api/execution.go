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

func (api *Api) NewExeuctionApi(executionMain execution.ManagerUseCases) {
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
