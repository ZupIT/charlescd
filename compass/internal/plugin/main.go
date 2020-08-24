package plugin

import (
	"compass/pkg/logger"
	"plugin"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	FindAll() ([]Plugin, error)
	GetPluginBySrc(id string) (*plugin.Plugin, error)
}

type Main struct {
	db     *gorm.DB
	logger logger.UseCases
}

func NewMain(db *gorm.DB, logger logger.UseCases) UseCases {
	return Main{db, logger}
}
