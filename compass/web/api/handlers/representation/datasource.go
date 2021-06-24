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

package representation

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
)

type DatasourceRequest struct {
	Name      string          `json:"name" validate:"required,max=100"`
	PluginSrc string          `json:"pluginSrc" validate:"required,max=100"`
	Data      json.RawMessage `json:"data" validate:"required"`
}

type DatasourceResponse struct {
	util.BaseModel
	Name        string          `json:"name"`
	PluginSrc   string          `json:"pluginSrc"`
	Data        json.RawMessage `json:"data"`
	WorkspaceID uuid.UUID       `json:"workspaceId"`
}

func (datasourceRequest DatasourceRequest) RequestToDomain(workspaceId uuid.UUID) domain.Datasource {
	return domain.Datasource{
		Name:        datasourceRequest.Name,
		PluginSrc:   datasourceRequest.PluginSrc,
		Data:        datasourceRequest.Data,
		WorkspaceID: workspaceId,
	}
}

func DomainToResponse(datasource domain.Datasource) DatasourceResponse {
	return DatasourceResponse{
		BaseModel:   datasource.BaseModel,
		Name:        datasource.Name,
		PluginSrc:   datasource.PluginSrc,
		Data:        datasource.Data,
		WorkspaceID: datasource.WorkspaceID,
	}
}

func DomainsToResponses(datasources []domain.Datasource) []DatasourceResponse {
	var datasourceResponse []DatasourceResponse
	for _, datasource := range datasources {
		datasourceResponse = append(datasourceResponse, DomainToResponse(datasource))
	}
	return datasourceResponse
}
