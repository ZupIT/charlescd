/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"github.com/ZupIT/charlescd/gate/internal/logging"
	authorizationInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/systoken"
	"github.com/ZupIT/charlescd/gate/web/api/handlers"
	"github.com/ZupIT/charlescd/gate/web/api/middlewares"
	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/go-playground/validator/v10/non-standard/validators"
	enTranslations "github.com/go-playground/validator/v10/translations/en"
	"github.com/labstack/echo-contrib/prometheus"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/leebenson/conform"
	"reflect"
	"strings"
)

type server struct {
	persistenceManager persistenceManager
	serviceManager     serviceManager
	httpServer         *echo.Echo
}

type customBinder struct{}

type CustomValidator struct {
	validator  *validator.Validate
	translator *ut.UniversalTranslator
}

func newServer(pm persistenceManager, sm serviceManager) server {
	return server{
		persistenceManager: pm,
		serviceManager:     sm,
		httpServer:         createHTTPServerInstance(),
	}
}

func (server server) start(port string) error {
	server.registerRoutes()
	return server.httpServer.Start(fmt.Sprintf(":%s", port))
}

func createHTTPServerInstance() *echo.Echo {
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
	err := cv.validator.Struct(i)
	if err != nil {
		return logging.NewValidationError(err, cv.translator)
	}
	return nil
}

func buildCustomValidator() *CustomValidator {
	v := validator.New()
	if err := v.RegisterValidation("notblank", validators.NotBlank); err != nil {
		return nil
	}
	v.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
	defaultLang := en.New()
	uniTranslator := ut.New(defaultLang, defaultLang)

	defaultTrans, _ := uniTranslator.GetTranslator("en")
	_ = enTranslations.RegisterDefaultTranslations(v, defaultTrans)

	return &CustomValidator{
		validator:  v,
		translator: uniTranslator,
	}
}

func (server server) registerRoutes() {
	server.httpServer.GET("/health", handlers.Health())
	server.httpServer.GET("/metrics", handlers.Metrics())

	api := server.httpServer.Group("/api")
	{
		v1 := api.Group("/v1")
		{
			systemToken := v1.Group("/system-token")
			{
				systemToken.POST("", handlers.CreateSystemToken(systemTokenInteractor.NewCreateSystemToken(server.persistenceManager.systemTokenRepository, server.persistenceManager.permissionRepository, server.persistenceManager.userRepository, server.persistenceManager.workspaceRepository, server.serviceManager.authTokenService)))
				systemToken.GET("/:id", handlers.GetSystemToken(systemTokenInteractor.NewGetSystemToken(server.persistenceManager.systemTokenRepository)))
				systemToken.GET("", handlers.GetAllSystemTokens(systemTokenInteractor.NewGetAllSystemToken(server.persistenceManager.systemTokenRepository)))
				systemToken.POST("/:id/revoke", handlers.RevokeSystemToken(systemTokenInteractor.NewRevokeSystemToken(server.persistenceManager.systemTokenRepository)))
				systemToken.PUT("/:id/regenerate", handlers.RegenerateSystemToken(systemTokenInteractor.NewRegenerateSystemToken(server.persistenceManager.systemTokenRepository)))
			}

			authorize := v1.Group("/authorize")
			{
				authorize.POST("", handlers.DoAuthorization(
					authorizationInteractor.NewAuthorizeUserToken(server.serviceManager.securityFilter, server.persistenceManager.userRepository, server.persistenceManager.workspaceRepository, server.serviceManager.authTokenService),
					authorizationInteractor.NewAuthorizeSystemToken(server.serviceManager.securityFilter, server.persistenceManager.systemTokenRepository, server.persistenceManager.permissionRepository, server.persistenceManager.workspaceRepository)))
			}
		}
	}
}
