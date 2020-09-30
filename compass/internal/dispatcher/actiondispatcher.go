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
	"compass/internal/metricsgroupaction"
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
	metricGroupRepo metricsgroup.UseCases
	actionRepo      action.UseCases
	pluginRepo      plugin.UseCases
	metricRepo      metric.UseCases
	groupActionRepo metricsgroupaction.UseCases
	mux             sync.Mutex
}

func NewActionDispatcher(metric metric.UseCases) UseCases {
	return &Dispatcher{metric, sync.Mutex{}}
}

func (dispatcher *ActionDispatcher) dispatch() {
	metricGroups, err := dispatcher.metricGroupRepo.FindAll()
	if err != nil {
		logger.Error("Cannot find any metric group", "Dispatch", err, nil)
	}

	for _, group := range metricGroups {
		if dispatcher.validateGroupReachedAllMetrics(group.Metrics) {
			go dispatcher.doAction(group)
		}
	}

	logger.Info("After 5 seconds... ", time.Now())
}

func (dispatcher *ActionDispatcher) doAction(group metricsgroup.MetricsGroup) {
	defer dispatcher.mux.Unlock()
	dispatcher.mux.Lock()

	for _, groupAction := range group.Actions {
		if dispatcher.groupActionRepo.ValidateActionCanBeExecuted(groupAction) {
			go dispatcher.executeAction(groupAction)
		}
	}
}

func (dispatcher *ActionDispatcher) executeAction(groupAction metricsgroupaction.MetricsGroupAction) {
	defer dispatcher.mux.Unlock()
	dispatcher.mux.Lock()

	execution, err := dispatcher.groupActionRepo.CreateNewExecution(groupAction.ID.String())
	if err != nil {
		logger.Error("error creating execution", "ActionDispatcherExecuteAction", err, nil)
		return
	}

	act, _ := dispatcher.actionRepo.FindActionById(groupAction.ActionID.String())
	actionPlugin, err := dispatcher.pluginRepo.GetPluginBySrc(act.Type)
	if err != nil {
		logger.Error("error finding actionPlugin", "doAction", err, act)
		dispatcher.groupActionRepo.SetExecutionFailed(execution.ID.String(), err.Error())
		return
	}

	_, err = actionPlugin.Lookup("Do")
	if err != nil {
		logger.Error("error executing plugin do action", "doAction", err, actionPlugin)
		dispatcher.groupActionRepo.SetExecutionFailed(execution.ID.String(), err.Error())
		return
	}

	dispatcher.groupActionRepo.SetExecutionSuccess(execution.ID.String(), "action executed with success")
}

func (dispatcher *ActionDispatcher) validateGroupReachedAllMetrics(metrics []metric.Metric) bool {
	for _, m := range metrics {
		if !dispatcher.metricRepo.ValidateIfExecutionReached(m.MetricExecution) {
			return false
		}
	}

	return true
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
