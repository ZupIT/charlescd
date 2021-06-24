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

package metrics_group_action

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteMetricsGroupAction interface {
	Execute(id uuid.UUID) error
}

type deleteMetricsGroupAction struct {
	metricsGroupActionRepository repository.MetricsGroupActionRepository
}

func NewDeleteMetricsGroupAction(m repository.MetricsGroupActionRepository) DeleteMetricsGroupAction {
	return deleteMetricsGroupAction{
		metricsGroupActionRepository: m,
	}
}

func (s deleteMetricsGroupAction) Execute(id uuid.UUID) error {
	err := s.metricsGroupActionRepository.DeleteGroupAction(id)
	if err != nil {
		return logging.WithOperation(err, "deleteMetricsGroupAction.Execute")
	}

	return nil
}
