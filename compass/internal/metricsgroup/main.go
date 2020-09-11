package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/metric"
	"compass/internal/plugin"
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	PeriodValidate(currentPeriod string) error
	Parse(metricsGroup io.ReadCloser) (MetricsGroup, error)
	FindAll() ([]MetricsGroup, error)
	ResumeByCircle(circleId string) ([]MetricGroupResume, error)
	Save(metricsGroup MetricsGroup) (MetricsGroup, error)
	FindById(id string) (MetricsGroup, error)
	Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error)
	Remove(id string) error
	QueryByGroupID(id, period, interval string) ([]datasourcePKG.MetricValues, error)
	ResultByGroup(group MetricsGroup) ([]datasourcePKG.MetricResult, error)
	ResultByID(id string) ([]datasourcePKG.MetricResult, error)
	FindCircleMetricGroups(circleId string) ([]MetricsGroup, error)
	Validate(metricsGroup MetricsGroup) []util.ErrorUtil
}

type Main struct {
	db             *gorm.DB
	metricMain     metric.UseCases
	datasourceMain datasource.UseCases
	pluginMain     plugin.UseCases
}

func NewMain(
	db *gorm.DB, metricMain metric.UseCases, datasourceMain datasource.UseCases, pluginMain plugin.UseCases,
) UseCases {
	return Main{db, metricMain, datasourceMain, pluginMain}
}
