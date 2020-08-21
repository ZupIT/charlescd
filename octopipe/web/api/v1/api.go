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

package v1

import (
	"errors"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"net/http"
)

type API struct {
	router *gin.Engine
	v1     *gin.RouterGroup
}

const (
	v1Path = "/api/v1"
	limitRequestBySeconds = 10
	limitRequestBurstBySeconds = 15
)

func NewAPI() *API {
	requestLimiter := rate.NewLimiter(limitRequestBySeconds,limitRequestBurstBySeconds)
	router := gin.Default()
	router.Use(throttle(requestLimiter))
	v1 := router.Group(v1Path)
	v1.GET("/health", health)
	return &API{router, v1}
}

func health(context *gin.Context) {
	context.JSON(200, "Hi :)")
}

func (api *API) Start() {
	api.router.Run(":8080")
}
func throttle(requestLimiter *rate.Limiter) gin.HandlerFunc {
	return func(context *gin.Context){
		if requestLimiter.Allow() {
			context.Next()
			return
		}
		context.Error(errors.New("Limit of requests reached"))
		context.AbortWithStatus(http.StatusTooManyRequests)
	}
}
