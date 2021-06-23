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
	"context"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"sync"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/configuration"
)

type ActionDispatcher struct {
	metricGroupRepo repository.MetricsGroupRepository
	actionRepo      repository.ActionRepository
	pluginRepo      repository.PluginRepository
	metricRepo      repository.MetricRepository
	groupActionRepo repository.MetricsGroupActionRepository
	mux             sync.Mutex
	ctx             context.Context
}

func NewActionDispatcher(metricGroupRepo repository.MetricsGroupRepository, actionRepo repository.ActionRepository, pluginRepo repository.PluginRepository,
	metricRepo repository.MetricRepository, groupActionRepo repository.MetricsGroupActionRepository, context context.Context) UseCases {

	return &ActionDispatcher{metricGroupRepo: metricGroupRepo, actionRepo: actionRepo, pluginRepo: pluginRepo,
		metricRepo: metricRepo, groupActionRepo: groupActionRepo, mux: sync.Mutex{}, ctx: context}
}

func (dispatcher *ActionDispatcher) dispatch() {

	metricGroups, err := dispatcher.metricGroupRepo.FindAll()
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.dispatch"))
	}

	for _, group := range metricGroups {
		if dispatcher.validateGroupReachedAllMetrics(group.Metrics) {
			go dispatcher.doAction(group)
		}
	}
}

func (dispatcher *ActionDispatcher) doAction(group domain.MetricsGroup) {
	defer dispatcher.mux.Unlock()
	dispatcher.mux.Lock()

	for _, groupAction := range group.Actions {
		if dispatcher.groupActionRepo.ValidateActionCanBeExecuted(groupAction) {
			go dispatcher.executeAction(groupAction)
		}
	}
}

func (dispatcher *ActionDispatcher) executeAction(groupAction domain.MetricsGroupAction) {
	defer dispatcher.mux.Unlock()
	dispatcher.mux.Lock()

	execution, err := dispatcher.groupActionRepo.CreateNewExecution(groupAction.ID)
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.executeAction"))
		return
	}

	act, err := dispatcher.actionRepo.FindActionById(groupAction.ActionID)
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.executeAction"))
		return
	}

	actionPlugin, err := dispatcher.pluginRepo.GetPluginBySrc(fmt.Sprintf("action/%s/%s", act.Type, act.Type))
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.executeAction"))

		_, err = dispatcher.groupActionRepo.SetExecutionFailed(execution.ID, err.Error())
		if err != nil {
			logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.executeAction"))
		}
		return
	}

	exec, lookupErr := actionPlugin.Lookup("Do")
	if lookupErr != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.NewError("Execute Action error", lookupErr, nil, "ActionDispatcher.executeAction.Lookup"))

		_, err = dispatcher.groupActionRepo.SetExecutionFailed(execution.ID, lookupErr.Error())
		if err != nil {
			logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.executeAction"))
		}
		return
	}

	result := exec.(func(actionConfig []byte, executionConfig []byte) error)(act.Configuration, groupAction.ExecutionParameters)
	if result != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.NewError("Execute Action error", result, nil, "ActionDispatcher.executeAction.exec"))

		_, err = dispatcher.groupActionRepo.SetExecutionFailed(execution.ID, result.Error())
		if err != nil {
			logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.executeAction"))
		}
		return
	}

	_, err = dispatcher.groupActionRepo.SetExecutionSuccess(execution.ID, "action executed with success")
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "ActionDispatcher.executeAction"))
	}
}

func (dispatcher *ActionDispatcher) validateGroupReachedAllMetrics(metrics []domain.Metric) bool {
	for _, m := range metrics {
		if !dispatcher.metricRepo.ValidateIfExecutionReached(m.MetricExecution) {
			return false
		}
	}

	return len(metrics) > 0
}

func (dispatcher *ActionDispatcher) getInterval() (time.Duration, error) {
	return time.ParseDuration(configuration.Get("DISPATCHER_INTERVAL"))
}

func (dispatcher *ActionDispatcher) Start(stopChan chan bool) error {
	interval, err := dispatcher.getInterval()
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.NewError("Start action dispatcher error", err, nil, "ActionDispatcher.Start.getInterval"))
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
