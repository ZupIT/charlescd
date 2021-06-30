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

package action

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type ListAction interface {
	Execute(workspaceId uuid.UUID) ([]domain.Action, error)
}

type listAction struct {
	actionRepository repository.ActionRepository
}

func NewListAction(a repository.ActionRepository) ListAction {
	return listAction{
		actionRepository: a,
	}
}

func (s listAction) Execute(workspaceId uuid.UUID) ([]domain.Action, error) {
	actions, err := s.actionRepository.FindAllActionsByWorkspace(workspaceId)
	if err != nil {
		return []domain.Action{}, logging.WithOperation(err, "createAction.Execute")
	}

	return actions, nil
}
