/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"fmt"
	"sync"
	"time"

	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/sirupsen/logrus"

	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
)

type ActionDispatcher struct {
	metricGroupRepo metricsgroup.UseCases
	actionRepo      action.UseCases
	pluginRepo      plugin.UseCases
	metricRepo      metric.UseCases
	groupActionRepo metricsgroupaction.UseCases
	mux             sync.Mutex
}

func NewActionDispatcher(metricGroupRepo metricsgroup.UseCases, actionRepo action.UseCases, pluginRepo plugin.UseCases,
	metricRepo metric.UseCases, groupActionRepo metricsgroupaction.UseCases) UseCases {

	return &ActionDispatcher{metricGroupRepo: metricGroupRepo, actionRepo: actionRepo, pluginRepo: pluginRepo,
		metricRepo: metricRepo, groupActionRepo: groupActionRepo, mux: sync.Mutex{}}
}

func (dispatcher *ActionDispatcher) dispatch() {

	metricGroups, err := dispatcher.metricGroupRepo.FindAll()
	if err != nil {
		logger.Error("Error consulting metrics groups", "Dispatch", nil, nil)
	}

	for _, group := range metricGroups {
		if dispatcher.validateGroupReachedAllMetrics(group.Metrics) {
			go dispatcher.doAction(group)
		}
	}
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
		logrus.WithFields(logrus.Fields{
			"err": err.WithOperations("executeAction.CreateNewExecution"),
		}).Errorln()
		return
	}

	act, err := dispatcher.actionRepo.FindActionByID(groupAction.ActionID.String())
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": err.WithOperations("executeAction.FindActionByID"),
		}).Errorln()
		return
	}

	actionPlugin, err := dispatcher.pluginRepo.GetPluginBySrc(fmt.Sprintf("action/%s/%s", act.Type, act.Type))
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": err.WithOperations("executeAction.GetPluginBySrc"),
		}).Errorln()

		_, err = dispatcher.groupActionRepo.SetExecutionFailed(execution.ID.String(), err.Error().Detail)
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"err": err.WithOperations("executeAction.GetPluginBySrc.SetExecutionFailed"),
			}).Errorln()
		}
		return
	}

	exec, lookupErr := actionPlugin.Lookup("Do")
	if lookupErr != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Execute dispatch error", lookupErr.Error()).
				WithOperations("executeAction.getInterval"),
		}).Errorln()

		_, err = dispatcher.groupActionRepo.SetExecutionFailed(execution.ID.String(), lookupErr.Error())
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"err": err.WithOperations("executeAction.Lookup.SetExecutionFailed"),
			}).Errorln()
		}
		return
	}

	result := exec.(func(actionConfig []byte, executionConfig []byte) error)(act.Configuration, groupAction.ExecutionParameters)
	if result != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Execute dispatch error", result.Error()).
				WithOperations("executeAction.exec"),
		}).Errorln()

		_, err = dispatcher.groupActionRepo.SetExecutionFailed(execution.ID.String(), result.Error())
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"err": err.WithOperations("executeAction.exec.SetExecutionFailed"),
			}).Errorln()
		}
		return
	}

	_, err = dispatcher.groupActionRepo.SetExecutionSuccess(execution.ID.String(), "action executed with success")
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": err.WithOperations("executeAction.SetExecutionSuccess"),
		}).Errorln()
	}
}

func (dispatcher *ActionDispatcher) validateGroupReachedAllMetrics(metrics []metric.Metric) bool {
	for _, m := range metrics {
		if !dispatcher.metricRepo.ValidateIfExecutionReached(m.MetricExecution) {
			return false
		}
	}

	return len(metrics) > 0
}

func (dispatcher *ActionDispatcher) getInterval() (time.Duration, error) {
	return time.ParseDuration(configuration.GetConfiguration("DISPATCHER_INTERVAL"))
}

func (dispatcher *ActionDispatcher) Start(stopChan chan bool) error {
	interval, err := dispatcher.getInterval()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start action dispatch", err.Error()).
				WithOperations("Start.getInterval"),
		}).Errorln()
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
