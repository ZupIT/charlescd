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

package main

import (
	"fmt"

	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	"github.com/ZupIT/charlescd/gate/web/api/handlers"
	"github.com/ZupIT/charlescd/gate/web/api/middlewares"
	"github.com/casbin/casbin/v2"
	"github.com/go-playground/validator/v10"
	"github.com/go-playground/validator/v10/non-standard/validators"
	"github.com/labstack/echo-contrib/prometheus"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/leebenson/conform"
)

type server struct {
	persistenceManager persistenceManager
	httpServer         *echo.Echo
	enforcer           *casbin.Enforcer
}

type customBinder struct{}

type CustomValidator struct {
	validator *validator.Validate
}

func newServer(pm persistenceManager) (server, error) {
	return server{
		persistenceManager: pm,
		httpServer:         createHttpServerInstance(),
	}, nil
}

func (server server) start(port string) error {
	server.registerRoutes()
	return server.httpServer.Start(fmt.Sprintf(":%s", port))
}

func createHttpServerInstance() *echo.Echo {
	httpServer := echo.New()
	httpServer.Use(echoMiddleware.RequestID())
	httpServer.Use(middlewares.ContextLogger)
	httpServer.Validator = buildCustomValidator()
	httpServer.Binder = echo.Binder(customBinder{})

	p := prometheus.NewPrometheus("echo", nil)
	p.Use(httpServer)

	return httpServer
}

func (cb customBinder) Bind(i interface{}, echoCtx echo.Context) (err error) {
	defaultBinder := new(echo.DefaultBinder)
	if err = defaultBinder.Bind(i, echoCtx); err != nil {
		return err
	}

	return conform.Strings(i)
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

func buildCustomValidator() *CustomValidator {
	v := validator.New()
	if err := v.RegisterValidation("notblank", validators.NotBlank); err != nil {
		return nil
	}

	return &CustomValidator{validator: v}
}

func (server server) registerRoutes() {
	server.httpServer.GET("/health", handlers.Health())
	server.httpServer.GET("/metrics", handlers.Metrics())

	api := server.httpServer.Group("/api")
	{
		v1 := api.Group("/v1")
		{
			st := v1.Group("/system-token")
			{
				st.GET("", handlers.GetAllSystemTokens(systemTokenInteractor.NewGetAllSystemToken(server.persistenceManager.systemTokenRepository)))
				st.GET("/:id", handlers.GetSystemToken(systemTokenInteractor.NewGetSystemToken(server.persistenceManager.systemTokenRepository)))
				st.POST("/:id/revoke", handlers.RevokeSytemToken(systemTokenInteractor.NewRevokeSystemToken(server.persistenceManager.systemTokenRepository)))
			}
		}
	}
}
