package metricsgroupaction

import (
	"compass/internal/action"
	"compass/internal/metricsgroup"
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
	db               *gorm.DB
	metricsGroupMain metricsgroup.UseCases
	actionMain       action.UseCases
}

func NewMain(db *gorm.DB, metricsGroupMain metricsgroup.UseCases, actionMain action.UseCases) UseCases {
	return Main{db, metricsGroupMain, actionMain}
}
