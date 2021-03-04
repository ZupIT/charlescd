package middlewares

import (
	"context"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/labstack/echo/v4"
)

func ContextLogger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		logger, err := logging.NewLogger()
		if err != nil {
			return err
		}
		defer logger.Sync()

		sugar := logger.Sugar().With("request-id", echoCtx.Response().Header().Get("x-request-id"))
		ctx := context.WithValue(echoCtx.Request().Context(), logging.LoggerFlag, sugar)
		echoCtx.SetRequest(echoCtx.Request().Clone(ctx))

		return next(echoCtx)
	}
}