package plugin

import (
	"io"
	"plugin"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Parse(metricsGroup io.ReadCloser) (Plugin, error)
	FindAll() ([]Plugin, error)
	Save(metricsGroup Plugin) (Plugin, error)
	FindById(id string) (Plugin, error)
	GetPluginByID(id string) (*plugin.Plugin, error)
	Update(id string, metricsGroup Plugin) (Plugin, error)
	Remove(id string) error
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
