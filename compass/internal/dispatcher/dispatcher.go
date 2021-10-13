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
	"sync"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/sirupsen/logrus"
)

type UseCases interface {
	Start(stopChan chan bool) error
}

type Dispatcher struct {
	metric metric.UseCases
	mux    sync.Mutex
}

var (
	metricsReachedOpts = promauto.NewCounter(prometheus.CounterOpts{
		Name: "metrics_reached_total",
		Help: "The total of metrics reached",
	})
)

func NewDispatcher(metric metric.UseCases) UseCases {
	return &Dispatcher{metric, sync.Mutex{}}
}

func (dispatcher *Dispatcher) dispatch() {

	metricExecutions, err := dispatcher.metric.FindAllMetricExecutions()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start dispatch", "Cannot find active metric executions").
				WithOperations("dispatch.FindAllMetricExecutions"),
		}).Errorln()
	}

	for _, execution := range metricExecutions {
		go dispatcher.getMetricResult(execution)
	}
}

func compareResultWithMetricThreshold(result float64, threshold float64, condition string) bool {
	switch condition {
	case metricsgroup.Equal.String():
		return result == threshold
	case metricsgroup.GreaterThan.String():
		return result > threshold
	case metricsgroup.LowerThan.String():
		return result < threshold
	default:
		return false
	}
}

func (dispatcher *Dispatcher) getNewStatusForExecution(metricResult float64, currentMetric metric.Metric) string {
	if compareResultWithMetricThreshold(metricResult, currentMetric.Threshold, currentMetric.Condition) {
		return metric.MetricReached
	}

	return metric.MetricActive
}

func (dispatcher *Dispatcher) getMetricResult(execution metric.MetricExecution) {
	defer dispatcher.mux.Unlock()
	dispatcher.mux.Lock()

	currentMetric, err := dispatcher.metric.FindMetricByID(execution.MetricID.String())
	if err != nil {
		return
	}

	metricResult, err := dispatcher.metric.ResultQuery(currentMetric)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": err.WithOperations("getMetricResult.ResultQuery"),
		}).Errorln()

		execution.Status = metric.MetricError
		dispatcher.metric.UpdateMetricExecution(execution)
		return
	}

	if metricResult != execution.LastValue || execution.Status == metric.MetricUpdated {
		dispatcher.metric.UpdateMetricExecution(metric.MetricExecution{
			BaseModel: execution.BaseModel,
			MetricID:  execution.MetricID,
			LastValue: metricResult,
			Status:    dispatcher.getNewStatusForExecution(metricResult, currentMetric),
		})

		metricsReachedOpts.Inc()
	}
}

func (dispatcher *Dispatcher) getInterval() (time.Duration, error) {
	return time.ParseDuration(configuration.GetConfiguration("DISPATCHER_INTERVAL"))
}

func (dispatcher *Dispatcher) Start(stopChan chan bool) error {
	interval, err := dispatcher.getInterval()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start dispatch", "Get sync interval failed").
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
