package middlewares

import (
	"context"
	"github.com/ZupIT/charlescd/gate/internal/tracking"
	"github.com/labstack/echo/v4"
)

func ContextLogger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		logger, err := tracking.NewLogger()
		if err != nil {
			return err
		}
		defer logger.Sync()

		sugar := logger.Sugar().With("request-id", echoCtx.Response().Header().Get("x-request-id"))
		ctx := context.WithValue(echoCtx.Request().Context(), tracking.LoggerFlag, sugar)
		echoCtx.SetRequest(echoCtx.Request().Clone(ctx))

		return next(echoCtx)
	}
}