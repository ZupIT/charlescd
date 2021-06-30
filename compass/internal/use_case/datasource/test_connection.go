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
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type TestConnection interface {
	Execute(pluginSrc string, datasourceData json.RawMessage) error
}

type testConnection struct {
	datasourceRepository repository.DatasourceRepository
}

func NewTestConnection(d repository.DatasourceRepository) TestConnection {
	return testConnection{
		datasourceRepository: d,
	}
}

func (t testConnection) Execute(pluginSrc string, datasourceData json.RawMessage) error {
	if err := t.datasourceRepository.TestConnection(pluginSrc, datasourceData); err != nil {
		return logging.WithOperation(err, "testConnection.Execute")
	}

	return nil
}
