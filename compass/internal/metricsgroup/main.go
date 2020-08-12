package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
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
	Query(id string) ([]MetricResult, error)
	FindActiveMetricGroups() ([]MetricsGroup, error)
}

type Main struct {
	db             *gorm.DB
	datasourceMain datasource.UseCases
	pluginMain     plugin.UseCases
}

func NewMain(db *gorm.DB, datasourceMain datasource.UseCases, pluginMain plugin.UseCases) UseCases {
	return Main{db, datasourceMain, pluginMain}
}
