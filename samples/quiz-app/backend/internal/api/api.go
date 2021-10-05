/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package api

import (
	"fmt"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"quiz_app/internal/answers"
	"quiz_app/internal/questions"
	"quiz_app/internal/types"

	"github.com/gin-gonic/gin"
)

const (
	path = "/v1"
)

func StartAPI() {
	router := gin.Default()

	apiPath := router.Group(path)
	apiPath.GET("/healthcheck", healthCheckHandler)
	apiPath.GET("/questions", getQuestions)
	apiPath.POST("/answers", setAnswers)
	apiPath.GET("/metrics", metrics)

	router.Run(":8080")
}

func healthCheckHandler(context *gin.Context) {
	context.JSON(200, "alive")
}

func getQuestions(context *gin.Context) {
	questionsList, err := questions.GetQuestions()
	if err != nil {
		fmt.Println(err)
		context.JSON(500, gin.H{"error": "Could not fetch questions"})
	}
	context.JSON(200, questionsList)
}

func setAnswers(context *gin.Context) {
	var userAnswers []types.UserAnswer
	context.Bind(&userAnswers)
	consolidatedScore, err := answers.SetAnswers(userAnswers)
	if err != nil {
		fmt.Println(err)
		context.JSON(500, gin.H{"error": "Could not set answers"})
	}
	context.JSON(200, consolidatedScore)
}

func metrics(context *gin.Context) {
	promhttp.Handler().ServeHTTP(context.Writer, context.Request)
}
