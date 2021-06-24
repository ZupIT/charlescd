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
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"sync"
	"time"
)

type UseCases interface {
	Start(stopChan chan bool) error
}

type MetricDispatcher struct {
	metricRepo          repository.MetricRepository
	metricExecutionRepo repository.MetricExecutionRepository
	mux                 sync.Mutex
	ctx                 context.Context
}

var (
	metricsReachedOpts = promauto.NewCounter(prometheus.CounterOpts{
		Name: "metrics_reached_total",
		Help: "The total of metrics reached",
	})
)

func NewMetricDispatcher(metricRepo repository.MetricRepository, metricExecutionRepo repository.MetricExecutionRepository, context context.Context) UseCases {
	return &MetricDispatcher{metricRepo, metricExecutionRepo, sync.Mutex{}, context}
}

func (dispatcher *MetricDispatcher) dispatch() {

	metricExecutions, err := dispatcher.metricExecutionRepo.FindAllMetricExecutions()
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "MetricDispatcher.dispatch"))
	}

	for _, execution := range metricExecutions {
		go dispatcher.getMetricResult(execution)
	}
}

func compareResultWithMetricThreshold(result float64, threshold float64, condition string) bool {
	switch condition {
	case repository.EQUAL.String():
		return result == threshold
	case repository.GREATER_THAN.String():
		return result > threshold
	case repository.LOWER_THAN.String():
		return result < threshold
	default:
		return false
	}
}

func (dispatcher *MetricDispatcher) getNewStatusForExecution(metricResult float64, currentMetric domain.Metric) string {
	if compareResultWithMetricThreshold(metricResult, currentMetric.Threshold, currentMetric.Condition) {
		return repository.MetricReached
	}

	return repository.MetricActive
}

func (dispatcher *MetricDispatcher) getMetricResult(execution domain.MetricExecution) {
	defer dispatcher.mux.Unlock()
	dispatcher.mux.Lock()

	currentMetric, err := dispatcher.metricRepo.FindMetricById(execution.MetricID)
	if err != nil {
		return
	}

	metricResult, err := dispatcher.metricRepo.ResultQuery(currentMetric)
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.WithOperation(err, "MetricDispatcher.getMetricResult"))
		execution.Status = repository.MetricError
		dispatcher.metricExecutionRepo.UpdateMetricExecution(execution)
		return
	}

	if metricResult != execution.LastValue || execution.Status == repository.MetricUpdated {
		dispatcher.metricExecutionRepo.UpdateMetricExecution(domain.MetricExecution{
			BaseModel: execution.BaseModel,
			MetricID:  execution.MetricID,
			LastValue: metricResult,
			Status:    dispatcher.getNewStatusForExecution(metricResult, currentMetric),
		})

		metricsReachedOpts.Inc()
	}
}

func (dispatcher *MetricDispatcher) getInterval() (time.Duration, error) {
	return time.ParseDuration(configuration.Get("DISPATCHER_INTERVAL"))
}

func (dispatcher *MetricDispatcher) Start(stopChan chan bool) error {
	interval, err := dispatcher.getInterval()
	if err != nil {
		logging.LogErrorFromCtx(dispatcher.ctx, logging.NewError("Start metric dispatcher error", err, nil, "MetricDispatcher.Start.getInterval"))
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
