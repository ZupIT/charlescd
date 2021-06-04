package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func DatasourceModelToDomain(datasource models.DataSource) domain.Datasource {
	return domain.Datasource{
		BaseModel:   datasource.BaseModel,
		Name:        datasource.Name,
		PluginSrc:   datasource.PluginSrc,
		Data:        datasource.Data,
		WorkspaceID: datasource.WorkspaceID,
	}

}

func DatasourceModelToDomains(datasource []models.DataSource) []domain.Datasource {
	datasources := make([]domain.Datasource, 0)
	for _, ds := range datasource {
		datasources = append(datasources, DatasourceModelToDomain(ds))
	}
	return datasources
}
