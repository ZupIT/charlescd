package main

import (
	"github.com/ZupIT/charlescd/compass/internal/dispatcher"
)

type jobManager struct {
	metricDispatcher dispatcher.UseCases
	actionDispatcher dispatcher.UseCases
}

func prepareJobs(pm persistenceManager) jobManager {
	metricDispatcher := dispatcher.NewMetricDispatcher(pm.metricRepository)

	actionDispatcher := dispatcher.NewActionDispatcher(pm.metricsGroupRepository, pm.actionRepository, pm.pluginRepository, pm.metricRepository, pm.metricsGroupAction)

	return jobManager{
		metricDispatcher: metricDispatcher,
		actionDispatcher: actionDispatcher,
	}
}

func (jm jobManager) startJobs() {
	stop := make(chan bool, 0)

	go jm.metricDispatcher.Start(stop)
	go jm.actionDispatcher.Start(stop)
}
