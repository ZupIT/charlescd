package api

import (
	"octopipe/pkg/execution"

	"github.com/gin-gonic/gin"
)

type ExecutionAPI struct {
	executionMain execution.UseCases
}

func (api *Api) NewExeuctionApi(executionMain execution.UseCases) {
	path := "/executions"

	executionAPI := ExecutionAPI{executionMain}
	api.v1.GET(path, executionAPI.findAll)
	api.v1.GET(path+"/<id>", executionAPI.findByID)
}

func (executionAPI *ExecutionAPI) findAll(context *gin.Context) {

}

func (executionAPI *ExecutionAPI) findByID(context *gin.Context) {

}
