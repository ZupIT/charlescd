package logging

import (
	"context"
	"github.com/ZupIT/charlescd/gate/internal/configuration"
	"go.uber.org/zap"
)

type LoggerType string

const LoggerFlag = LoggerType("api-logger-context")

func NewLogger() (*zap.Logger, error) {
	var config zap.Config
	if configuration.IsRunningInProduction() {
		config = zap.NewProductionConfig()
	} else {
		config = zap.NewDevelopmentConfig()
	}
	config.DisableStacktrace = true

	logger, err := config.Build()
	if err != nil {
		return nil, err
	}

	return logger, nil
}

func LoggerFromContext(ctx context.Context) (*zap.SugaredLogger, bool) {
	logger, ok := ctx.Value(LoggerFlag).(*zap.SugaredLogger)
	return logger, ok
}

func LogErrorFromCtx(ctx context.Context, err error) {
	if logger, okLogger := LoggerFromContext(ctx); okLogger {
		internalErr, okErr := err.(*CustomError)
		if okErr {
			logger.Errorw(internalErr.Message,
				"error-id", internalErr.ID,
				"details", internalErr.Detail,
				"operations", internalErr.Operations,
				"meta-info", internalErr.Meta)
			return
		}

		logger.Error(err)
	}
}