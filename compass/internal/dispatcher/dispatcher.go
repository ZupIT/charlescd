package dispatcher

import (
	"compass/internal/configuration"
	"compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/util"
	"fmt"
	"log"
	"sync"
	"time"
)

type UseCases interface {
	Start() error
}

type Dispatcher struct {
	metric metric.UseCases
	mux    sync.Mutex
}

func NewDispatcher(metric metric.UseCases) UseCases {
	return &Dispatcher{metric, sync.Mutex{}}
}

func (dispatcher *Dispatcher) dispatch() {
	metricExecutions, err := dispatcher.metric.FindAllActivesMetricExecutions()
	if err != nil {
		util.Panic("Cannot find active metric executions", "Dispatch", err, nil)
	}

	for _, execution := range metricExecutions {
		go dispatcher.getMetricResult(execution)
	}

	fmt.Printf("after 5 seconds... %s", time.Now().String())
}

func compareResultWithMetricThreshold(result float64, threshold float64, condition string) bool {
	switch condition {
	case metricsgroup.EQUAL.String():
		return result == threshold
	case metricsgroup.GREATER_THAN.String():
		return result > threshold
	case metricsgroup.LOWER_THAN.String():
		return result < threshold
	default:
		return false
	}
}

func (dispatcher *Dispatcher) getMetricResult(execution metric.MetricExecution) {
	currentMetric, err := dispatcher.metric.FindMetricById(execution.MetricID.String())
	if err != nil {
		return
	}

	metricResult, err := dispatcher.metric.ResultQuery(currentMetric)
	if err != nil {
		util.Error(util.ResultByGroupMetricError, "getMetricResult", err, currentMetric)
		dispatcher.mux.Lock()
		execution.Status = metric.MetricError
		dispatcher.metric.SaveMetricExecution(execution)
		dispatcher.mux.Unlock()
		return
	}

	if metricResult != execution.LastValue {
		if compareResultWithMetricThreshold(metricResult, currentMetric.Threshold, currentMetric.Condition) {
			execution.Status = metric.MetricReached
		} else {
			execution.Status = metric.MetricActive
		}

		dispatcher.mux.Lock()
		execution.LastValue = metricResult
		dispatcher.metric.SaveMetricExecution(execution)
		dispatcher.mux.Unlock()
	}
}

func (dispatcher *Dispatcher) getInterval() (time.Duration, error) {
	return time.ParseDuration(configuration.GetConfiguration("DISPATCHER_INTERVAL"))
}

func (dispatcher *Dispatcher) Start() error {
	interval, err := dispatcher.getInterval()
	if err != nil {
		log.Fatalln(err)
		return err
	}

	for {
		time.Sleep(interval)
		dispatcher.dispatch()
	}
}
