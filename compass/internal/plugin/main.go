package plugin

import (
	"compass/pkg/logger"
	"io"
	"plugin"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Parse(plugin io.ReadCloser) (Plugin, error)
	FindAll() ([]Plugin, error)
	Save(plugin Plugin) (Plugin, error)
	FindById(id string) (Plugin, error)
	GetPluginByID(id string) (*plugin.Plugin, error)
	Update(id string, plugin Plugin) (Plugin, error)
	Remove(id string) error
}

type Main struct {
	db     *gorm.DB
	logger logger.UseCases
}

func NewMain(db *gorm.DB, logger logger.UseCases) UseCases {
	return Main{db, logger}
}
