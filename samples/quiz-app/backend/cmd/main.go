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

package main

import (
	"quiz_app/internal/api"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	automationFirstMetrics = promauto.NewCounter(prometheus.CounterOpts{
		Name: "automation_first_metric",
		Help: "Metric for automation tests",
	})

	automationSecondMetrics = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "automation_second_metric",
		Help: "Metric for automation tests",
	}, []string{"label1", "label2"})
)

func main() {
	incFakeMetrics()
	api.StartAPI()
}

func incFakeMetrics() {
	automationFirstMetrics.Add(50)
	automationSecondMetrics.WithLabelValues("test1", "test2").Add(20)
	automationSecondMetrics.WithLabelValues("test10", "test11").Add(30)
}
