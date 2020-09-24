package health

import (
	"compass/internal/datasource"
	"compass/internal/plugin"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Components(workspaceId, circleId, projectionType, metricType string) (ComponentMetricRepresentation, error)
}

type Main struct {
	db         *gorm.DB
	datasource datasource.UseCases
	pluginMain plugin.UseCases
}

func NewMain(db *gorm.DB, datasource datasource.UseCases, pluginMain plugin.UseCases) UseCases {
	return Main{db, datasource, pluginMain}
}
