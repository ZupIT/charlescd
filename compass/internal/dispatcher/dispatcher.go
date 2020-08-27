package dispatcher

import (
	"compass/internal/configuration"
	"compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/util"
	"compass/pkg/logger"
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
		logger.Panic("Cannot find active metric executions", "Dispatch", err, nil)
	}

	for _, execution := range metricExecutions {
		go dispatcher.getMetricResult(execution)
	}

	logger.Info("After 5 seconds... ", time.Now())
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

func (dispatcher *Dispatcher) getNewStatusForExecution(metricResult float64, currentMetric metric.Metric) string {
	if compareResultWithMetricThreshold(metricResult, currentMetric.Threshold, currentMetric.Condition) {
		return metric.MetricReached
	}

	return metric.MetricActive
}

func (dispatcher *Dispatcher) getMetricResult(execution metric.MetricExecution) {
	defer dispatcher.mux.Unlock()
	dispatcher.mux.Lock()

	currentMetric, err := dispatcher.metric.FindMetricById(execution.MetricID.String())
	if err != nil {
		return
	}

	metricResult, err := dispatcher.metric.ResultQuery(currentMetric)
	if err != nil {
		logger.Error(util.ResultByGroupMetricError, "getMetricResult", err, currentMetric)
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
