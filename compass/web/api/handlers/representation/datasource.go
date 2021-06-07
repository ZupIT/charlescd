package representation

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
)

type DatasourceRequest struct {
	Name      string          `json:"name" validate:"notblank, max=100"`
	PluginSrc string          `json:"pluginSrc" validate:"notblank, max=100"`
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
