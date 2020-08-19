package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	datasourcePKG "compass/pkg/datasource"
	"compass/pkg/logger"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	PeriodValidate(currentPeriod string) error
	Parse(metricsGroup io.ReadCloser) (MetricsGroup, error)
	ParseMetric(metric io.ReadCloser) (Metric, error)
	FindAll() ([]MetricsGroup, error)
	ResumeByCircle(circleId string) ([]MetricGroupResume, error)
	Save(metricsGroup MetricsGroup) (MetricsGroup, error)
	SaveMetric(metric Metric) (Metric, error)
	FindById(id string) (MetricsGroup, error)
	Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error)
	UpdateMetric(id string, metric Metric) (Metric, error)
	Remove(id string) error
	RemoveMetric(id string) error
	Query(id, period string) ([]datasourcePKG.MetricValues, error)
	ResultByGroup(group MetricsGroup) ([]datasourcePKG.MetricResult, error)
	ResultByID(id string) ([]datasourcePKG.MetricResult, error)
	FindActiveMetricGroups() ([]MetricsGroup, error)
}

type Main struct {
	db             *gorm.DB
	datasourceMain datasource.UseCases
	pluginMain     plugin.UseCases
	logger         logger.UseCases
}

func NewMain(
	db *gorm.DB, datasourceMain datasource.UseCases, pluginMain plugin.UseCases, logger logger.UseCases,
) UseCases {
	return Main{db, datasourceMain, pluginMain, logger}
}
