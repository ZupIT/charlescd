package datasource

import (
	"compass/internal/plugin"
	"compass/internal/util"
	"compass/pkg/datasource"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Parse(dataSource io.ReadCloser) (DataSource, error)
	FindAllByWorkspace(workspaceID string, health string) ([]DataSource, error)
	FindById(id string) (DataSource, error)
	Save(dataSource DataSource) (DataSource, error)
	Delete(id string) error
	GetMetrics(dataSourceID, name string) (datasource.MetricList, error)
	Validate(dataSource DataSource) []util.ErrorUtil
}

type Main struct {
	db         *gorm.DB
	pluginMain plugin.UseCases
}

func NewMain(db *gorm.DB, pluginMain plugin.UseCases) UseCases {
	return Main{db, pluginMain}
}
