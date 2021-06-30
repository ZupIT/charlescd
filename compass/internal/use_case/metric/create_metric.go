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

package metric

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type CreateMetric interface {
	Execute(metricsGroup domain.Metric) (domain.Metric, error)
}

type createMetrics struct {
	metricRepository       repository.MetricRepository
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewCreateMetric(m repository.MetricRepository, mg repository.MetricsGroupRepository) CreateMetric {
	return createMetrics{
		metricRepository:       m,
		metricsGroupRepository: mg,
	}
}

func (s createMetrics) Execute(metric domain.Metric) (domain.Metric, error) {
	metricGroup, err := s.metricsGroupRepository.FindById(metric.MetricsGroupID)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "createMetric.Execute")
	}

	metric.CircleID = metricGroup.CircleID

	_, err = s.metricRepository.ResultQuery(metric)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "createMetric.Execute")
	}

	mg, err := s.metricRepository.SaveMetric(metric)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "createMetric.Execute")
	}

	return mg, nil
}

func getFieldValidateByMetric(metric domain.Metric) map[string]string {
	field := "metric"
	if metric.Query != "" {
		field = "query"
	}

	return map[string]string{"field": field}
}
