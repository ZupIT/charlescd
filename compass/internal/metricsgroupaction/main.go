package metricsgroupaction

import (
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	Validate(metricsGroupAction MetricsGroupAction) []util.ErrorUtil
	Parse(metricsGroupAction io.ReadCloser) (MetricsGroupAction, error)
	FindById(id string) (MetricsGroupAction, error)
	FindAll() ([]MetricsGroupAction, error)
	Save(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error)
	Delete(id string) error
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
