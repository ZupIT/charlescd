package health

import (
	"compass/internal/datasource"
	"compass/internal/moove"
	"compass/internal/plugin"
	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Components(workspaceId, circleId, projectionType, metricType string) (ComponentMetricRepresentation, error)
	ComponentsHealth(workspaceId, circleId string) (CircleHealthRepresentation, error)
}

type Main struct {
	db         *gorm.DB
	datasource datasource.UseCases
	pluginMain plugin.UseCases
	mooveMain  moove.APIClient
}

func NewMain(db *gorm.DB, datasource datasource.UseCases, pluginMain plugin.UseCases, mooveMain moove.APIClient) UseCases {
	return Main{db, datasource, pluginMain, mooveMain}
}
