package main

import (
	"fmt"
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
	httpServer     *echo.Echo
	enforcer *casbin.Enforcer
}

type customBinder struct{}

type CustomValidator struct {
	validator *validator.Validate
}

func newServer(pm persistenceManager) (server, error) {
	return server{
		persistenceManager:   pm,
		httpServer: createHttpServerInstance(),
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
	api := server.httpServer.Group("")
	{
		api.GET("/health", handlers.Health())
		api.GET("/metrics", handlers.Metrics())
	}
}