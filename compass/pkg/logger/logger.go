package logger

import (
	"compass/internal/configuration"
	"github.com/sirupsen/logrus"
	"time"
)

func Info(msg string, data interface{}) {
	if configuration.GetConfiguration("ENV") == "TEST" {
		return
	}

	logrus.WithFields(logrus.Fields{
		"Data": data,
	}).Infoln(msg)
}

func Error(msg string, functionName string, err error, data interface{}) {
	if configuration.GetConfiguration("ENV") == "TEST" {
		return
	}

	logrus.WithFields(logrus.Fields{
		"Error":        err,
		"FunctionName": functionName,
		"Data":         data,
	}).WithTime(time.Now()).Errorln(msg)
}
func Panic(msg string, functionName string, err error, data interface{}) {
	if configuration.GetConfiguration("ENV") == "TEST" {
		return
	}

	logrus.WithFields(logrus.Fields{
		"Error":        err,
		"FunctionName": functionName,
		"Data":         data,
	}).WithTime(time.Now()).Panicln(msg)
}

func Fatal(msg string, err error) {
	logrus.Fatalln(msg, err)
}
