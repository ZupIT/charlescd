package api

import (
	"github.com/gin-gonic/gin"
)

type Api struct {
	router *gin.Engine
	v1     *gin.RouterGroup
}

const (
	v1Path = "/api/v1"
)

func NewApi() *Api {
	router := gin.Default()

	v1 := router.Group(v1Path)
	v1.GET("/health", health)
	return &Api{router, v1}
}

func health(context *gin.Context) {
	context.JSON(200, "is alive")
}

func (api *Api) Start() {
	api.router.Run(":8080")
}
