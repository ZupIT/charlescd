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
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteAction interface {
	Execute(id uuid.UUID) error
}

type deleteAction struct {
	actionRepository repository.ActionRepository
}

func NewDeleteAction(a repository.ActionRepository) DeleteAction {
	return deleteAction{
		actionRepository: a,
	}
}

func (s deleteAction) Execute(id uuid.UUID) error {
	err := s.actionRepository.DeleteAction(id)
	if err != nil {
		return logging.WithOperation(err, "createAction.Execute")
	}

	return nil
}
