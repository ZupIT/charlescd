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
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
)

type GetMetrics interface {
	Execute(workspaceId uuid.UUID) (datasource.MetricList, error)
}

type getMetrics struct {
	datasourceRepository repository.DatasourceRepository
}

func NewGetMetrics(d repository.DatasourceRepository) GetMetrics {
	return getMetrics{
		datasourceRepository: d,
	}
}

func (g getMetrics) Execute(datasourceId uuid.UUID) (datasource.MetricList, error) {
	metrics, err := g.datasourceRepository.GetMetrics(datasourceId)
	if err != nil {
		return datasource.MetricList{}, logging.WithOperation(err, "getMetrics.Execute")
	}

	return metrics, nil
}
