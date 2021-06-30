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

package main

import (
	"context"
	"github.com/ZupIT/charlescd/compass/internal/dispatcher"
)

type jobManager struct {
	metricDispatcher dispatcher.UseCases
	actionDispatcher dispatcher.UseCases
}

func prepareJobs(pm persistenceManager) jobManager {

	ctx := context.Background()

	metricDispatcher := dispatcher.NewMetricDispatcher(pm.metricRepository, pm.metricExecutionRepository, ctx)

	actionDispatcher := dispatcher.NewActionDispatcher(pm.metricsGroupRepository, pm.actionRepository, pm.pluginRepository, pm.metricExecutionRepository, pm.metricsGroupAction, pm.actionExecutionRepository, ctx)

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
