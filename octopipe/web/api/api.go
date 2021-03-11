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

package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"golang.org/x/time/rate"
	"net/http"
	"os"
	"strconv"
	"time"
)

type API struct {
	router *gin.Engine
	v1     *gin.RouterGroup
	v2     *gin.RouterGroup
}

const (
	v1Path                       = "/api/v1"
	v2Path                       = "/api/v2"
	DefaultLimitRequestsBySecond = 10
)

func NewAPI() *API {
	requestLimiter := getLimiter()
	router := gin.New()
	router.Use(throttle(requestLimiter))

	v1 := router.Group(v1Path)
	v1.GET("/health", health)

	v2 := router.Group(v2Path)

	return &API{router, v1, v2}
}

func health(context *gin.Context) {
	context.JSON(200, "Hi :)")
}

func (api *API) Start() {
	api.router.Run(":8080")
}

func throttle(requestLimiter *rate.Limiter) gin.HandlerFunc {
	return func(context *gin.Context) {
		if requestLimiter.Allow() {
			context.Next()
			return
		}
		context.Error(errors.New("limit of requests by second reached"))
		context.AbortWithStatus(http.StatusTooManyRequests)
	}
}

func getLimiter() *rate.Limiter {
	limitRequestsBySecond, error := strconv.ParseInt(os.Getenv("LIMIT_REQUESTS_BY_SECOND"), 0, 32)
	if error != nil {
		log.WithFields(log.Fields{"function": "getLimiter"}).Error("Cannot read env var. Error: " + error.Error())
		limitRequestsBySecond = DefaultLimitRequestsBySecond
	}
	rt := rate.Every(time.Second / time.Duration(limitRequestsBySecond))
	return rate.NewLimiter(rt, int(limitRequestsBySecond))
}
