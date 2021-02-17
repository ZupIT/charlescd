package handlers

import (
	"github.com/labstack/echo/v4"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"net/http"
)

func Health() echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		return echoCtx.JSON(http.StatusOK, "It's Fine")
	}
}

func Metrics() echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		promhttp.Handler().ServeHTTP(echoCtx.Response().Writer, echoCtx.Request())
		return nil
	}
}