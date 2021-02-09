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
	pm       persistenceManager
	echo     *echo.Echo
	enforcer *casbin.Enforcer
}

type customBinder struct{}

type CustomValidator struct {
	validator *validator.Validate
}

func newServer(pm persistenceManager) (server, error) {
	return server{
		pm:       pm,
		echo:     createEchoInstance(),
	}, nil
}

func (s server) start(port string) error {
	s.registerRoutes()
	return s.echo.Start(fmt.Sprintf(":%s", port))
}

func createEchoInstance() *echo.Echo {
	e := echo.New()
	e.Use(echoMiddleware.RequestID())
	e.Use(middlewares.ContextLogger)
	e.Validator = buildCustomValidator()
	e.Binder = echo.Binder(customBinder{})
	p := prometheus.NewPrometheus("echo", nil)
	p.Use(e)

	return e
}

func (cb customBinder) Bind(i interface{}, c echo.Context) (err error) {
	db := new(echo.DefaultBinder)
	if err = db.Bind(i, c); err != nil {
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

func (s server) registerRoutes() {
	api := s.echo.Group("")
	{
		api.GET("/health", handlers.Health())
		api.GET("/metrics", handlers.Metrics())
	}
}