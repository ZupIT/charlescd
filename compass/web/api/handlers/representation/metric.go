package representation

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
)

type MetricRequest struct {
	MetricsGroupID  uuid.UUID              `json:"metricGroupId"`
	DataSourceID    uuid.UUID              `json:"dataSourceId"`
	Nickname        string                 `json:"nickname" validate:"notblank, max=64"`
	Query           string                 `json:"query" validate:"required_without=Metric"`
	Metric          string                 `json:"metric" validate:"required_without=Query, max=64"`
	Filters         []MetricFilterRequest  `json:"filters"`
	GroupBy         []MetricGroupByRequest `json:"groupBy"`
	Condition       string                 `json:"condition"`
	Threshold       float64                `json:"threshold"`
	CircleID        uuid.UUID              `json:"circleId"`
	MetricExecution MetricExecutionRequest `json:"execution"`
}

type MetricFilterRequest struct {
	Field    string `json:"field" validate:"max=100"`
	Value    string `json:"value" validate:"max=100"`
	Operator string `json:"operator"`
}

type MetricGroupByRequest struct {
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field" validate:"max=100"`
}

func (metricRequest MetricRequest) MetricRequestToDomain(metricsGroupId uuid.UUID) domain.Metric {
	return domain.Metric{
		MetricsGroupID:  metricRequest.MetricsGroupID,
		DataSourceID:    metricRequest.DataSourceID,
		Nickname:        metricRequest.Nickname,
		Query:           metricRequest.Query,
		Metric:          metricRequest.Metric,
		Filters:         MetricFilterRequestToDomains(metricRequest.Filters),
		GroupBy:         MetricGroupByRequestToDomains(metricRequest.GroupBy),
		Condition:       metricRequest.Condition,
		Threshold:       metricRequest.Threshold,
		CircleID:        metricRequest.CircleID,
		MetricExecution: metricRequest.MetricExecution.MetricExecutionRequestToDomain(),
	}
}

func (metricGroupByRequest MetricGroupByRequest) MetricGroupByRequestToDomain() domain.MetricGroupBy {
	return domain.MetricGroupBy{
		MetricID: metricGroupByRequest.MetricID,
		Field:    metricGroupByRequest.Field,
	}
}

func (metricFilterRequest MetricFilterRequest) MetricFilterRequestToDomain() datasourcePKG.MetricFilter {
	return datasourcePKG.MetricFilter{
		Field:    metricFilterRequest.Field,
		Value:    metricFilterRequest.Value,
		Operator: metricFilterRequest.Operator,
	}
}

func MetricGroupByRequestToDomains(metricGroupBies []MetricGroupByRequest) []domain.MetricGroupBy {
	var metricGroupByList []domain.MetricGroupBy
	for _, metricGroupBy := range metricGroupBies {
		metricGroupByList = append(metricGroupByList, metricGroupBy.MetricGroupByRequestToDomain())
	}
	return metricGroupByList
}

func MetricFilterRequestToDomains(metricFilters []MetricFilterRequest) []datasourcePKG.MetricFilter {
	var metricFilterList []datasourcePKG.MetricFilter
	for _, metricFilter := range metricFilters {
		metricFilterList = append(metricFilterList, metricFilter.MetricFilterRequestToDomain())
	}
	return metricFilterList
}
