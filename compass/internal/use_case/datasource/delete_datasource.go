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

package datasource

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteDatasource interface {
	Execute(id uuid.UUID) error
}

type deleteDatasource struct {
	datasourceRepository repository.DatasourceRepository
}

func NewDeleteDatasource(d repository.DatasourceRepository) DeleteDatasource {
	return deleteDatasource{
		datasourceRepository: d,
	}
}

func (s deleteDatasource) Execute(id uuid.UUID) error {
	err := s.datasourceRepository.Delete(id)
	if err != nil {
		return logging.WithOperation(err, "deleteDatasource.Execute")
	}

	return nil
}
