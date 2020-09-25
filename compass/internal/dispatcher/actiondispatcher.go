/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package dispatcher

import (
	"compass/internal/action"
	"compass/internal/configuration"
	"compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"compass/pkg/logger"
	"log"
	"sync"
	"time"
)

type ActionUseCases interface {
	Start(stopChan chan bool) error
}

type ActionDispatcher struct {
	metricGroup      metricsgroup.UseCases
	actionRepository action.UseCases
	pluginRepository plugin.UseCases
	mux              sync.Mutex
}

func NewActionDispatcher(metric metric.UseCases) UseCases {
	return &Dispatcher{metric, sync.Mutex{}}
}

func (dispatcher *ActionDispatcher) dispatch() {
	metricGroups, err := dispatcher.metricGroup.FindAll()
	if err != nil {
		logger.Panic("Cannot find any metric group", "Dispatch", err, nil)
	}

	for _, execution := range metricGroups {
		go dispatcher.doAction(execution)
	}

	logger.Info("After 5 seconds... ", time.Now())
}

func (dispatcher *ActionDispatcher) doAction(group metricsgroup.MetricsGroup) {
	if validateGroupNeedsAction(group.Metrics) {
		for _, groupAction := range group.Actions {
			action, _ := dispatcher.actionRepository.FindActionById(groupAction.ActionID.String())
			dispatcher.pluginRepository.GetPluginBySrc(action.Type)
		}
	}
}

func validateGroupNeedsAction(metrics []metric.Metric) bool {

	return false
}

func (dispatcher *ActionDispatcher) getInterval() (time.Duration, error) {
	return time.ParseDuration(configuration.GetConfiguration("DISPATCHER_INTERVAL"))
}

func (dispatcher *ActionDispatcher) Start(stopChan chan bool) error {
	interval, err := dispatcher.getInterval()
	if err != nil {
		log.Fatalln(err)
		return err
	}

	ticker := time.NewTicker(interval)
	for {
		select {
		case <-ticker.C:
			dispatcher.dispatch()
		case <-stopChan:
			return nil
		}
	}
}
