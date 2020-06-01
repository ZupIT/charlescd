package api

import (
	"github.com/gin-gonic/gin"
)

func StartAPI() {
	router := gin.Default()
	router.GET("/healthcheck", healthCheckHandler)
	router.Run(":8080")
}

func healthCheckHandler(context *gin.Context) {
	context.JSON(200, "alive")
}