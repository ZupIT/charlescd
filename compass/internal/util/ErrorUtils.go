package util

import (
	log "github.com/sirupsen/logrus"
	"time"
)

const (
	DatasourceSaveError           = "DATASOURCE_SAVE_ERROR"
	VerifyDatasourceHealthError   = "VERIFY_HEALTH_ERROR"
	ExistingDatasourceHealthError = "EXISTING_HEALTHY_DATASOURCE_ERROR"
	FindDatasourceError           = "FIND_DATASOURCE_ERROR"
	ParseDatasourceError          = "PARSE_ERROR"
	DeleteDatasourceError         = "DELETE_ERROR"
	OpenPluginError               = "OPEN_PLUGIN_ERROR"
	PluginLookupError             = "PLUGIN_LOOKUP_ERROR"
	PluginListError               = "PLUGIN_LIST_ERROR"
)

//
//func (logger Logger) Info(msg string, functionName string, data interface{}, keysAndValues ...interface{}) {
//	keysAndValues = append(keysAndValues, "functionName", functionName, "data", data)
//	logger.logProvider.Infow(msg, keysAndValues...)
//}

func Error(msg string, functionName string, err error, data interface{}) {
	errorLogger := log.WithFields(log.Fields{
		"Message":      msg,
		"Error":        err,
		"FunctionName": functionName,
		"Data":         data,
	}).WithTime(time.Now())
	log.Error(errorLogger)
}
