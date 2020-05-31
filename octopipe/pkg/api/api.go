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
	"github.com/gin-gonic/gin"
)

type Api struct {
	router *gin.Engine
	v1     *gin.RouterGroup
}

const (
	v1Path = "/api/v1"
)

func NewAPI() *Api {
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
