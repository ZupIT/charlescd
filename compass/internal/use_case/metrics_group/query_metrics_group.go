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

package metrics_group

import (
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type QueryMetricsGroup interface {
	Execute(id uuid.UUID, periodParameter, intervalParameter string) ([]domain.MetricValues, error)
}

type queryMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewQueryMetricsGroup(d repository.MetricsGroupRepository) QueryMetricsGroup {
	return queryMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s queryMetricsGroup) Execute(id uuid.UUID, periodParameter, intervalParameter string) ([]domain.MetricValues, error) {

	if periodParameter == "" || intervalParameter == "" {
		return []domain.MetricValues{}, logging.NewError("Period or interval params is required", errors.New("invalid parameters"), nil, "queryMetricsGroup.Execute")
	}

	ragePeriod, err := s.metricsGroupRepository.PeriodValidate(periodParameter)
	if err != nil {
		return []domain.MetricValues{}, logging.WithOperation(err, "queryMetricsGroup.Execute.PeriodValidate")
	}

	interval, err := s.metricsGroupRepository.PeriodValidate(intervalParameter)
	if err != nil {
		return []domain.MetricValues{}, logging.WithOperation(err, "queryMetricsGroup.Execute.PeriodValidate")
	}

	query, err := s.metricsGroupRepository.QueryByGroupID(id, ragePeriod, interval)
	if err != nil {
		return []domain.MetricValues{}, logging.WithOperation(err, "queryMetricsGroup.Execute")
	}

	return query, nil
}
