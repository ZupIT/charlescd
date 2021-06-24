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
)

type CreateMetricsGroup interface {
	Execute(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
}

type createMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewCreateMetricsGroup(d repository.MetricsGroupRepository) CreateMetricsGroup {
	return createMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s createMetricsGroup) Execute(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	mg, err := s.metricsGroupRepository.Save(metricsGroup)
	if err != nil {
		return domain.MetricsGroup{}, logging.WithOperation(err, "createMetricsGroup.Execute")
	}

	return mg, nil
}
