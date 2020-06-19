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
	gintrace "gopkg.in/DataDog/dd-trace-go.v1/contrib/gin-gonic/gin"
	"gopkg.in/DataDog/dd-trace-go.v1/ddtrace/tracer"

	"github.com/gin-gonic/gin"
)

type API struct {
	router *gin.Engine
	v1     *gin.RouterGroup
}

const (
	v1Path = "/api/v1"
)

func NewAPI() *API {
	router := gin.Default()

	v1 := router.Group(v1Path)
	v1.GET("/health", health)
	return &API{router, v1}
}

func health(context *gin.Context) {
	context.JSON(200, "is alive")
}

func (api *API) Start() {
	tracer.Start()
	defer tracer.Stop()
	api.router.Use(gintrace.Middleware("octopipe"))
	api.router.Run(":8080")
}
