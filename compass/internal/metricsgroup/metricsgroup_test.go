package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	"compass/internal/util"
	"compass/pkg/logger/fake"
	"database/sql"
	"io/ioutil"
	"regexp"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
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

	fakeLogger := fake.NewLoggerFake()

	var pluginMain = plugin.NewMain(s.DB, fakeLogger)
	var datasourceMain = datasource.NewMain(s.DB, pluginMain, fakeLogger)

	s.repository = NewMain(s.DB, datasourceMain, pluginMain, fakeLogger)
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) TestValidate() {
	metric := Metric{
		BaseModel: util.BaseModel{
			ID:        uuid.UUID{},
			CreatedAt: time.Time{},
		},
		MetricsGroupID: uuid.UUID{},
		DataSourceID:   uuid.UUID{},
		Metric:         "test",
		Condition:      "EQUAL",
		Threshold:      0,
		Status:         "",
	}
	metricGroup := MetricsGroup{Metrics: []Metric{metric}}

	var errList = metricGroup.Validate()

	require.NotEmpty(s.T(), errList)
}

func (s *Suite) TestParseMetricsGroup() {
	stringReader := strings.NewReader(`{
    "name": "Metricas de teste2",
    "metrics": [
        {
            "dataSourceId": "b9d285fc-542b-4828-9e30-d28355b5fefb",
            "metric": "istio_charles_request_total",
            "query": "",
            "filters": [
                {
                    "field": "circle_id",
                    "value": "5c7979b7-51fd-4c16-8f2e-2c5d93651ed1",
                    "operator": "="
                },
                {
                    "field": "circle_source",
                    "value": "f5d23a57-5607-4306-9993-477e1598cc2a",
                    "operator": "="
                }
            ],
            "groupBy": [
                {
                    "field": "app"
                }
            ],
            "condition": "EQUAL",
            "threshold": 30.0
        }
    ],
    "circleId": "b9d285fc-542b-4828-9e30-d28355b5fefb"
}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.Parse(stringReadCloser)

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *Suite) TestParseMetricsGroupError() {
	stringReader := strings.NewReader(`{ERROR}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.Parse(stringReadCloser)

	require.Error(s.T(), err)
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
	s.mock.MatchExpectationsInOrder(false)
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

func (s *Suite) TestFindAllError() {
	id := uuid.New()
	timeNow := time.Now()
	var (
		name        = "test-name"
		workspaceID = uuid.New()
		status      = "ACTIVE"
		circleId    = uuid.New()
	)

	s.mock.MatchExpectationsInOrder(false)
	metricsGroupRows := sqlmock.
		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
		AddRow(id, name, workspaceID, status, circleId, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "metrics_groupss"`)).
		WillReturnRows(metricsGroupRows)

	_, err := s.repository.FindAll()

	require.Error(s.T(), err)
}

func (s *Suite) TestFindById() {
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

	s.mock.MatchExpectationsInOrder(false)
	metricsGroupRows := sqlmock.
		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
		AddRow(id, name, workspaceID, status, circleId, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "metrics_groups"  WHERE (id = $1) ORDER BY "metrics_groups"."id" ASC LIMIT 1`)).
		WithArgs(id).
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

	res, err := s.repository.FindById(id.String())

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
	require.Equal(s.T(), res, metricGroup)
}

func (s *Suite) TestFindByIdError() {
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
	s.mock.MatchExpectationsInOrder(false)
	metricsGroupRows := sqlmock.
		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
		AddRow(id, name, workspaceID, status, circleId, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "ERROR"  WHERE (id = $1) ORDER BY "metrics_groups"."id" ASC LIMIT 1`)).
		WithArgs(id).
		WillReturnRows(metricsGroupRows)

	_, err := s.repository.FindById(id.String())

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

	require.Error(s.T(), err)
}

func (s *Suite) TestRemove() {
	id := uuid.New()
	query := regexp.QuoteMeta(`DELETE FROM "metrics_groups"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	resErr := s.repository.Remove(id.String())

	require.NoError(s.T(), resErr)
	require.Nil(s.T(), resErr)
}

func (s *Suite) TestRemoveError() {
	id := uuid.New()
	query := regexp.QuoteMeta(`DELETE FROM "error"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	err := s.repository.Remove(id.String())

	require.Error(s.T(), err)
}

func (s *Suite) TestUpdateMetricsGroup() {
	id := uuid.New()

	metricsGroupStruct := MetricsGroup{
		BaseModel:   util.BaseModel{},
		Name:        "Metricas de teste222",
		Metrics:     nil,
		Status:      "",
		WorkspaceID: uuid.UUID{},
		CircleID:    id,
	}

	query := regexp.QuoteMeta(`UPDATE "metrics_groups"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	res, err := s.repository.Update(id.String(), metricsGroupStruct)

	require.NoError(s.T(), err)
	require.Equal(s.T(), metricsGroupStruct, res)
}

func (s *Suite) TestUpdateMetricsGroupError() {
	id := uuid.New()

	metricsGroupStruct := MetricsGroup{
		BaseModel:   util.BaseModel{},
		Name:        "Metricas de teste222",
		Metrics:     nil,
		Status:      "",
		WorkspaceID: uuid.UUID{},
		CircleID:    id,
	}

	query := regexp.QuoteMeta(`UPDATE "error"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	_, err := s.repository.Update(id.String(), metricsGroupStruct)

	require.Error(s.T(), err)
}

func (s *Suite) TestSaveMetricsGroup() {
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
		metricName = "Metrictest"
		condition  = "test"
		threshold  = 1.2
	)

	metricList := make([]Metric, 0)

	metric := Metric{
		BaseModel: util.BaseModel{
			ID:        uuid.UUID{},
			CreatedAt: time.Time{},
		},
		MetricsGroupID: uuid.UUID{},
		DataSourceID:   id,
		Metric:         metricName,
		Condition:      condition,
		Threshold:      threshold,
		Status:         "",
	}

	metricList = append(metricList, metric)

	metricsGroupStruct := MetricsGroup{
		BaseModel:   baseModel,
		Name:        name,
		Metrics:     metricList,
		Status:      status,
		WorkspaceID: workspaceID,
		CircleID:    circleId,
	}
	metricsGroupQuery := regexp.QuoteMeta(`INSERT INTO "metrics_groups"`)
	metricsQuery := regexp.QuoteMeta(`INSERT INTO "metrics"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectQuery(metricsGroupQuery).
		WithArgs(sqlmock.AnyArg(), metricsGroupStruct.CreatedAt, metricsGroupStruct.Name, metricsGroupStruct.Status, metricsGroupStruct.WorkspaceID, metricsGroupStruct.CircleID).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))

	s.mock.ExpectQuery(metricsQuery).
		WithArgs(sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg()).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
	s.mock.ExpectCommit()

	res, err := s.repository.Save(metricsGroupStruct)
	require.NoError(s.T(), err)
	require.Equal(s.T(), metricsGroupStruct, res)
}

func (s *Suite) TestSaveMetricsGroupError() {
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
		metricName = "Metrictest"
		condition  = "test"
		threshold  = 1.2
	)

	metricList := make([]Metric, 0)

	metric := Metric{
		BaseModel: util.BaseModel{
			ID:        uuid.UUID{},
			CreatedAt: time.Time{},
		},
		MetricsGroupID: uuid.UUID{},
		DataSourceID:   id,
		Metric:         metricName,
		Condition:      condition,
		Threshold:      threshold,
		Status:         "",
	}

	metricList = append(metricList, metric)

	metricsGroupStruct := MetricsGroup{
		BaseModel:   baseModel,
		Name:        name,
		Metrics:     metricList,
		Status:      status,
		WorkspaceID: workspaceID,
		CircleID:    circleId,
	}
	metricsGroupQuery := regexp.QuoteMeta(`INSERT INTO "metrics_groups"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectQuery(metricsGroupQuery).
		WithArgs(sqlmock.AnyArg(), metricsGroupStruct.CreatedAt, metricsGroupStruct.Name, metricsGroupStruct.Status, metricsGroupStruct.WorkspaceID, metricsGroupStruct.CircleID).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))

	_, err := s.repository.Save(metricsGroupStruct)
	require.Error(s.T(), err)
}

func (s *Suite) TestFindActiveMetricGroups() {
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
		metricName = "Metrictest"
		condition  = "test"
		threshold  = 1.2
	)

	metric := Metric{
		BaseModel:      baseModel,
		MetricsGroupID: id,
		DataSourceID:   id,
		Metric:         metricName,
		Condition:      condition,
		Threshold:      threshold,
		Status:         status,
	}

	metricList := make([]Metric, 0)
	metricList = append(metricList, metric)

	metricsGroup := MetricsGroup{
		BaseModel:   baseModel,
		Name:        name,
		Metrics:     metricList,
		Status:      status,
		WorkspaceID: workspaceID,
		CircleID:    circleId,
	}

	metricGroupList := make([]MetricsGroup, 0)
	metricGroupList = append(metricGroupList, metricsGroup)

	query := regexp.QuoteMeta(`SELECT * FROM "metrics_groups" WHERE (status = $1)`)

	s.mock.MatchExpectationsInOrder(false)
	metricsGroupRows := sqlmock.
		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
		AddRow(id, name, workspaceID, status, circleId, timeNow)
	s.mock.ExpectQuery(query).
		WithArgs(status).
		WillReturnRows(metricsGroupRows)

	metricRows := sqlmock.
		NewRows([]string{"id", "metric", "threshold", "condition", "metrics_group_id", "data_source_id", "status", "created_at"}).
		AddRow(id, metricName, threshold, condition, id, id, status, timeNow)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "metrics" WHERE ("metrics_group_id" IN ($1))`)).
		WithArgs(id).
		WillReturnRows(metricRows)

	res, err := s.repository.FindActiveMetricGroups()

	require.NoError(s.T(), err)
	require.Equal(s.T(), metricGroupList, res)
}

func (s *Suite) TestFindActiveMetricGroupsError() {
	id := uuid.New()
	timeNow := time.Now()
	var (
		name        = "test-name"
		workspaceID = uuid.New()
		status      = "ACTIVE"
		circleId    = uuid.New()
	)

	query := regexp.QuoteMeta(`SELECT * FROM "metrics_groups" WHERE (status = $1)`)

	s.mock.MatchExpectationsInOrder(false)
	metricsGroupRows := sqlmock.
		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
		AddRow(id, name, workspaceID, status, circleId, timeNow)
	s.mock.ExpectQuery(query).
		WithArgs(status).
		WillReturnRows(metricsGroupRows)

	_, err := s.repository.FindActiveMetricGroups()

	require.Error(s.T(), err)
}
