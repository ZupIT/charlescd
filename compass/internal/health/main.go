package health

import (
	"compass/internal/datasource"
	"compass/internal/plugin"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
}

type Main struct {
	db         *gorm.DB
	datasource datasource.UseCases
	pluginMain plugin.UseCases
}

func NewMain(db *gorm.DB, datasource datasource.UseCases, pluginMain plugin.UseCases) UseCases {
	return Main{db, datasource, pluginMain}
}
