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

type UpdateMetric interface {
	Execute(metric domain.Metric) (domain.Metric, error)
}

type updateMetric struct {
	metricRepository repository.MetricRepository
}

func NewUpdateMetric(m repository.MetricRepository) UpdateMetric {
	return updateMetric{
		metricRepository: m,
	}
}

func (s updateMetric) Execute(metric domain.Metric) (domain.Metric, error) {
	_, err := s.metricRepository.ResultQuery(metric)
	if err != nil {
		return domain.Metric{}, logging.NewError("Result Query error", err, getFieldValidateByMetric(metric), "updateMetric.Execute")
	}

	mg, err := s.metricRepository.UpdateMetric(metric)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "updateMetric.Execute")
	}

	return mg, nil
}
