package log

import (
	"encoding/json"
	log "github.com/sirupsen/logrus"
	"k8s.io/klog"
	"octopipe/pkg/customerror"
	"reflect"
	"time"
)

type Log struct {
	Type    string `json:"type"`
	Title   string `json:"title"`
	Details string `json:"details,omitempty"`
	TimeStamp string `json:"timestamp"`
}

type Aggregator struct {
	Logs []Log
}

func (e *Aggregator) AppendInfoAndLog(title string) {
	klog.Info(title)
	logEvent :=  Log{
		Type: "INFO",
		Title:   title,
		TimeStamp: time.Now().String(),
	}

	e.Logs =  append(e.Logs, logEvent)

}

func (e *Aggregator) AppendInfo(title string) {
	logEvent :=  Log{
		Type: "INFO",
		Title:   title,
		TimeStamp: time.Now().String(),
	}

	e.Logs =  append(e.Logs, logEvent)
}

func (e *Aggregator) AppendErrorAndLog(err error) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	var customError customerror.Customerror
	errorBytes, _ := json.Marshal(err)
	_ = json.Unmarshal(errorBytes, &customError)
	if !reflect.DeepEqual(customError, customerror.Customerror{}) && len(customError.Detail) >  0 || len(customError.Title) > 0 {
		log := Log{
			Type: "ERROR",
			Title:   customError.Title,
			Details: customError.Detail,
			TimeStamp: time.Now().String(),
		}
		e.Logs = append(e.Logs, log)
	}
}

func (e *Aggregator) CleanLogs() {
	e.Logs = make([]Log,0)
}