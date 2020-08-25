package metric

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	"compass/internal/util"
	"compass/pkg/logger"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	ParseMetric(metric io.ReadCloser) (Metric, error)
	CountAllMetricsWithConditions(metrics []Metric) int
	CountAllMetricsFinished(metrics []Metric) int
	CountAllMetricsInGroup(metrics []Metric) int
	FindMetricById(id string) (Metric, error)
	SaveMetric(metric Metric) (Metric, error)
	UpdateMetric(id string, metric Metric) (Metric, error)
	RemoveMetric(id string) error
	Query(metric Metric, period string) (interface{}, error)
	ResultQuery(metric Metric) (float64, error)
	UpdateMetricExecution(metricExecution MetricExecution) (MetricExecution, error)
	FindAllActivesMetricExecutions() ([]MetricExecution, error)
	Validate(metric Metric) []util.ErrorUtil
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
