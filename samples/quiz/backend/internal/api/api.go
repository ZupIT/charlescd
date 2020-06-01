package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"quiz_app/internal/answers"
	"quiz_app/internal/questions"
	"quiz_app/internal/types"
)

func StartAPI() {
	router := gin.Default()
	router.GET("/healthcheck", healthCheckHandler)
	router.GET("/questions", getQuestions)
	router.POST("/answers", setAnswers)
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

func setAnswers(context *gin.Context) {
	var userAnswers []types.UserAnswer
	context.Bind(&userAnswers)
	consolidatedScore, err := answers.SetAnswers(userAnswers)
	if err != nil {
		fmt.Println(err)
		context.JSON(500, gin.H{ "error": "Could not set answers" })
	}
	context.JSON(200, consolidatedScore)
}