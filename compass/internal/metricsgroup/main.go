package metricsgroup

import (
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Parse(metricsGroup io.ReadCloser) (MetricsGroup, error)
	ParseMetric(metric io.ReadCloser) (Metric, error)
	FindAll() ([]MetricsGroup, error)
	Save(metricsGroup MetricsGroup) (MetricsGroup, error)
	SaveMetric(metric Metric) (Metric, error)
	FindById(id string) (MetricsGroup, error)
	Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error)
	UpdateMetric(id string, metric Metric) (Metric, error)
	Remove(id string) error
	RemoveMetric(id string) error
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
