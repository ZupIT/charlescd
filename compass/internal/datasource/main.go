package datasource

import (
	"compass/internal/plugin"
	"compass/pkg/datasource"
	"compass/pkg/logger"
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
}

type Main struct {
	db         *gorm.DB
	pluginMain plugin.UseCases
	logger     logger.UseCases
}

func NewMain(db *gorm.DB, pluginMain plugin.UseCases, logger logger.UseCases) UseCases {
	return Main{db, pluginMain, logger}
}
