package metricsgroup

import (
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Parse(metricsGroup io.ReadCloser) (MetricsGroup, error)
	FindAll() ([]MetricsGroup, error)
	Save(metricsGroup MetricsGroup) (MetricsGroup, error)
	FindById(id string) (MetricsGroup, error)
	Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error)
	Remove(id string) error
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
