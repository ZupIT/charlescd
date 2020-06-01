package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"quiz_app/internal/questions"
)

func StartAPI() {
	router := gin.Default()
	router.GET("/healthcheck", healthCheckHandler)
	router.GET("/questions", getQuestions)
	router.Run(":8080")
}

func healthCheckHandler(context *gin.Context) {
	context.JSON(200, "alive")
}

func getQuestions(context *gin.Context) {
	questionsList, err := questions.GetQuestions()
	if err != nil {
		fmt.Println(err)
		context.JSON(500, gin.H{ "error": "Could not fetch questions" })
	}
	context.JSON(200, questionsList)
}