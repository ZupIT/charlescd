package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	"compass/internal/util"
	"database/sql"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"regexp"
	"testing"
	"time"
)

type Suite struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository UseCases
	datasource *MetricsGroup
}

func (s *Suite) SetupSuite() {
	var (
		db  *sql.DB
		err error
	)

	db, s.mock, err = sqlmock.New()
	require.NoError(s.T(), err)

	s.DB, err = gorm.Open("postgres", db)
	require.NoError(s.T(), err)

	s.DB.LogMode(true)

	var pluginMain = plugin.NewMain(s.DB)
	var datasourceMain = datasource.NewMain(s.DB, pluginMain)

	s.repository = NewMain(s.DB, datasourceMain, pluginMain)
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) TestFindAll() {
	id := uuid.New()
	timeNow := time.Now()
	var (
		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
		name        = "test-name"
		workspaceID = uuid.New()
		status      = "ACTIVE"
		circleId    = uuid.New()
	)
	var (
		metricId   = id
		metricName = "Metrictest"
		condition  = "test"
		threshold  = 1.2
	)
	var (
		field    = "circle_id"
		value    = "5c7979b7-51fd-4c16-8f2e-2c5d93651ed1"
		operator = "="
	)

	metricsGroupRows := sqlmock.
		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
		AddRow(id, name, workspaceID, status, circleId, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "metrics_groups"`)).
		WillReturnRows(metricsGroupRows)

	metricRows := sqlmock.
		NewRows([]string{"id", "metric", "threshold", "condition", "metrics_group_id", "data_source_id", "status", "created_at"}).
		AddRow(id, metricName, threshold, condition, id, id, status, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "metrics" WHERE ("metrics_group_id" IN ($1))`)).
		WithArgs(id).
		WillReturnRows(metricRows)

	metricFilterRows := sqlmock.
		NewRows([]string{"id", "field", "value", "operator", "metric_id", "created_at"}).
		AddRow(id, field, value, operator, metricId, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "metric_filters" WHERE ("metric_id" IN ($1))`)).
		WithArgs(metricId).
		WillReturnRows(metricFilterRows)

	metricGroupByRows := sqlmock.
		NewRows([]string{"id", "field", "metric_id", "created_at"}).
		AddRow(id, field, metricId, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "metric_group_bies" WHERE ("metric_id" IN ($1))`)).
		WithArgs(metricId).
		WillReturnRows(metricGroupByRows)

	res, err := s.repository.FindAll()

	filterList := make([]MetricFilter, 0)
	groupByList := make([]MetricGroupBy, 0)
	metricList := make([]Metric, 0)

	metricFilter := MetricFilter{
		BaseModel: baseModel,
		MetricID:  metricId,
		Field:     field,
		Value:     value,
		Operator:  operator,
	}

	metricGroupBy := MetricGroupBy{
		BaseModel: baseModel,
		MetricID:  metricId,
		Field:     field,
	}
	filterList = append(filterList, metricFilter)
	groupByList = append(groupByList, metricGroupBy)

	metric := Metric{
		BaseModel:      baseModel,
		MetricsGroupID: id,
		DataSourceID:   id,
		Metric:         metricName,
		Filters:        filterList,
		GroupBy:        groupByList,
		Condition:      condition,
		Threshold:      threshold,
		Status:         status,
	}

	metricList = append(metricList, metric)

	metricGroup := MetricsGroup{
		BaseModel:   baseModel,
		Name:        name,
		Metrics:     metricList,
		Status:      status,
		WorkspaceID: workspaceID,
		CircleID:    circleId,
	}
	require.NoError(s.T(), err)
	require.Contains(s.T(), res, metricGroup)
}
