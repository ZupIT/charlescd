package fake

import "compass/pkg/logger"

type FakeLogger struct{}

func NewLoggerFake() logger.UseCases {
	return FakeLogger{}
}

func (logger FakeLogger) Info(msg string, functionName string, data interface{}, keysAndValues ...interface{}) {
}

func (logger FakeLogger) Error(msg string, functionName string, err error, data interface{}, keysAndValues ...interface{}) {
}
