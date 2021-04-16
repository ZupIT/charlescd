/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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