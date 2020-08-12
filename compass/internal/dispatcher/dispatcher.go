package dispatcher

import (
	"compass/internal/metricsgroup"
	"fmt"
	"log"
	"time"
)

func dispatch(metricsgroup metricsgroup.UseCases, sleepTime time.Duration) {
	defer time.Sleep(sleepTime)
	groups, err := metricsgroup.FindActiveMetricGroups()

	if err != nil {
		log.Panic("Cannot find active metric groups")
	}

	for _, group := range groups {
		go getMetricResult(group)
	}

	fmt.Printf("after 5 seconds... %s", time.Now().String())
}

func getMetricResult(group metricsgroup.MetricsGroup) {

}

func StartDispatcher(metricsgroup metricsgroup.UseCases, sleepTime int) {
	for {
		dispatch(metricsgroup, time.Duration(sleepTime)*time.Second)
	}
}
