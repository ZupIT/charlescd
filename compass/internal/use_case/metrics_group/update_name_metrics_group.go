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
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type UpdateNameMetricsGroup interface {
	Execute(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
}

type updateNameMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewUpdateNameMetricsGroup(d repository.MetricsGroupRepository) UpdateNameMetricsGroup {
	return updateNameMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s updateNameMetricsGroup) Execute(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	mg, err := s.metricsGroupRepository.UpdateName(id, metricsGroup)
	if err != nil {
		return domain.MetricsGroup{}, logging.WithOperation(err, "updateMetricsGroup.Execute")
	}

	return mg, nil
}
