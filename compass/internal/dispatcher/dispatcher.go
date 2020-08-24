package dispatcher

import (
	"compass/internal/metricsgroup"
	"compass/internal/util"
	"fmt"
	"sync"
	"time"
)

type UseCases interface {
	Start()
}

type Dispatcher struct {
	metricsGroups metricsgroup.UseCases
	mux           sync.Mutex
}

func NewDispatcher(metricsgroup metricsgroup.UseCases) UseCases {
	return &Dispatcher{metricsgroup, sync.Mutex{}}
}

func (dispatcher *Dispatcher) dispatch() {
	metricExecutions, err := dispatcher.metricsGroups.FindAllActivesMetricExecutions()
	if err != nil {
		util.Panic("Cannot find active metric executions", "Dispatch", err, nil)
	}

	for _, execution := range metricExecutions {
		go dispatcher.getMetricResult(execution)
	}

	fmt.Printf("after 5 seconds... %s", time.Now().String())
}

func compareResultWithMetricTreshhold(result float64, threshold float64, condition string) bool {
	switch condition {
	case metricsgroup.EQUAL.String():
		return result == threshold
	case metricsgroup.GREATER_THEN.String():
		return result > threshold
	case metricsgroup.LOWER_THEN.String():
		return result < threshold
	default:
		return false
	}
}

func (dispatcher *Dispatcher) getMetricResult(execution metricsgroup.MetricExecution) {
	metric, err := dispatcher.metricsGroups.FindMetricById(execution.MetricID.String())
	if err != nil {
		return
	}

	metricResult, err := dispatcher.metricsGroups.ResultQuery(metric)
	if err != nil {
		util.Error(util.ResultByGroupMetricError, "getMetricResult", err, metric)
		return
	}

	if compareResultWithMetricTreshhold(metricResult, metric.Threshold, metric.Condition) {
		dispatcher.mux.Lock()
		execution.Status = metricsgroup.Completed
		dispatcher.metricsGroups.SaveMetricExecution(execution)
		dispatcher.mux.Unlock()
	}

	dispatcher.mux.Lock()
	execution.LastValue = metricResult
	dispatcher.metricsGroups.SaveMetricExecution(execution)
	dispatcher.mux.Unlock()
}

func (dispatcher *Dispatcher) Start() {
	for {
		time.Sleep(2 * time.Second)
		dispatcher.dispatch()
	}
}
