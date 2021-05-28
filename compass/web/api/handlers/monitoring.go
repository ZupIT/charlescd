package handlers

import (
	"github.com/labstack/echo/v4"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"net/http"
)

func Health() echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, "It's Fine")
	}
}

func Metrics() echo.HandlerFunc {
	return func(c echo.Context) error {
		promhttp.Handler().ServeHTTP(c.Response().Writer, c.Request())
		return nil
	}
}
