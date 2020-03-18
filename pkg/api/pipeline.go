package api

import (
	"octopipe/pkg/mozart"
	"octopipe/pkg/pipeline"

	"github.com/gin-gonic/gin"
)

type PipelineApi struct {
	mozart mozart.UseCases
}

func (api *Api) NewPipelineApi(mozart mozart.UseCases) {
	path := "/pipelines"
	controller := PipelineApi{mozart}

	api.v1.POST(path, controller.startPipeline)
}

func (api *PipelineApi) startPipeline(ctx *gin.Context) {
	var pipeline *pipeline.Pipeline
	ctx.Bind(&pipeline)

	execution, _ := api.mozart.Start(pipeline)

	ctx.JSON(200, map[string]string{"executionID": execution.ID.String()})
}
