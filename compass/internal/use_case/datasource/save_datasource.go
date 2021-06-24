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
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type SaveDatasource interface {
	Execute(datasource domain.Datasource) (domain.Datasource, error)
}

type saveDatasource struct {
	datasourceRepository repository.DatasourceRepository
}

func NewDatasource(d repository.DatasourceRepository) SaveDatasource {
	return saveDatasource{
		datasourceRepository: d,
	}
}

func (s saveDatasource) Execute(datasource domain.Datasource) (domain.Datasource, error) {
	savedDatasource, err := s.datasourceRepository.Save(datasource)
	if err != nil {
		return domain.Datasource{}, logging.WithOperation(err, "saveDatasource.Execute")
	}

	return savedDatasource, nil
}
