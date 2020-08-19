package dispatcher

import (
	"compass/internal/metricsgroup"
	"fmt"
	"log"
	"time"
)

type UseCases interface {
	Start()
}

type Dispatcher struct {
	metricsGroups metricsgroup.UseCases
}

func NewDispatcher(metricsgroup metricsgroup.UseCases) UseCases {
	return Dispatcher{metricsgroup}
}

func (dispatcher Dispatcher) dispatch() {
	groups, err := dispatcher.metricsGroups.FindActiveMetricGroups()

	if err != nil {
		log.Panic("Cannot find active metric groups")
	}

	for _, group := range groups {
		go dispatcher.getMetricResult(group)
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

func getAllActiveMetrics(metrics []metricsgroup.Metric) []metricsgroup.Metric {
	activeMetrics := []metricsgroup.Metric{}
	for _, metric := range metrics {
		if metric.Status == metricsgroup.Active {
			activeMetrics = append(activeMetrics, metric)
		}
	}

	return activeMetrics
}

func (dispatcher Dispatcher) getMetricResult(group metricsgroup.MetricsGroup) {
	metricResults, err := dispatcher.metricsGroups.ResultByGroup(group)
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, metric := range getAllActiveMetrics(group.Metrics) {
		for _, metricResult := range metricResults {
			if metric.Metric == metricResult.Metric &&
				compareResultWithMetricTreshhold(metricResult.Result, metric.Threshold, metric.Condition) {

				metric.Status = metricsgroup.Completed
				dispatcher.metricsGroups.UpdateMetric(metric.ID.String(), metric)
			}
		}
	}
}

func (dispatcher Dispatcher) Start() {
	for {
		time.Sleep(2 * time.Second)
		dispatcher.dispatch()
	}
}
