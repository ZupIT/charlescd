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
	return &Api{router, v1}
}

func (api *Api) Start() {
	api.router.Run(":8080")
}
