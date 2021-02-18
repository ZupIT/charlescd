package tracking

import (
	"github.com/ZupIT/charlescd/gate/internal/configuration"
	"go.uber.org/zap"
)

type LoggerType string

const LoggerFlag = LoggerType("api-logger-context")

func NewLogger() (*zap.Logger, error) {
	var logger *zap.Logger
	var err error

	if configuration.IsRunningInProduction() {
		logger, err = zap.NewProduction()
	} else {
		logger, err = zap.NewDevelopment()
	}

	if err != nil {
		return nil, err
	}

	return logger, nil
}