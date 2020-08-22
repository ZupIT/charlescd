package logger

import "go.uber.org/zap"

type UseCases interface {
	Info(msg string, functionName string, data interface{}, keysAndValues ...interface{})
	Error(msg string, functionName string, err error, data interface{}, keysAndValues ...interface{})
}

type Logger struct {
	logProvider *zap.SugaredLogger
}

func NewLogger(logProvider *zap.SugaredLogger) UseCases {
	return Logger{logProvider}
}

func (logger Logger) Info(msg string, functionName string, data interface{}, keysAndValues ...interface{}) {
	keysAndValues = append(keysAndValues, "functionName", functionName, "data", data)
	logger.logProvider.Infow(msg, keysAndValues...)
}

func (logger Logger) Error(msg string, functionName string, err error, data interface{}, keysAndValues ...interface{}) {
	keysAndValues = append(keysAndValues, "functionName", functionName, "err", err, "data", data)
	logger.logProvider.Errorw(msg, keysAndValues...)
}
