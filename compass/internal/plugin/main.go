package plugin

import (
	"plugin"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	FindAll() ([]Plugin, error)
	GetPluginBySrc(id string) (*plugin.Plugin, error)
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
