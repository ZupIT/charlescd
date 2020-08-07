package datasource

import (
	"compass/internal/plugin"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Parse(dataSource io.ReadCloser) (DataSource, error)
	FindAllByWorkspace(workspaceID string) ([]DataSource, error)
	Save(dataSource DataSource) (DataSource, error)
	Delete(id string, workspaceID string) error
	GetMetrics(dataSourceID, name string) (MetricList, error)
	SetAsHealth(id string, workspaceID string) error
}

type Main struct {
	db         *gorm.DB
	pluginMain plugin.UseCases
}

func NewMain(db *gorm.DB, pluginMain plugin.UseCases) UseCases {
	return Main{db, pluginMain}
}
