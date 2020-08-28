package metricsgroup

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/metric"
	"compass/internal/plugin"
	"compass/internal/util"
	"io/ioutil"
	"strings"
	"testing"

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
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(true)

	pluginMain := plugin.NewMain(s.DB)
	datasourceMain := datasource.NewMain(s.DB, pluginMain)
	metricMain := metric.NewMain(s.DB, datasourceMain, pluginMain)

	s.repository = NewMain(s.DB, metricMain, datasourceMain, pluginMain)
}

func (s *Suite) BeforeTest(suiteName, testName string) {
	s.DB.Exec("DELETE FROM metrics_groups")
	s.DB.Exec("DELETE FROM data_sources")
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) TestValidate() {
	newMetricGroup := MetricsGroup{
		Name:        "Metric group",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	errList := s.repository.Validate(newMetricGroup)
	require.Empty(s.T(), errList)
}

func (s *Suite) TestValidateError() {
	newMetricGroup := MetricsGroup{
		Name:        "",
		CircleID:    uuid.Nil,
		WorkspaceID: uuid.Nil,
	}

	ers := s.repository.Validate(newMetricGroup)

	require.Equal(s.T(), util.ErrorUtil{Field: "name", Error: "Name is required"}, ers[0])
	require.Equal(s.T(), util.ErrorUtil{Field: "circleID", Error: "CircleID is required"}, ers[1])
}

func (s *Suite) TestValidateNameLength() {
	newMetricGroup := MetricsGroup{
		Name:        "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	ers := s.repository.Validate(newMetricGroup)
	require.Equal(s.T(), util.ErrorUtil{Field: "name", Error: "100 Maximum length in Name"}, ers[0])
}

func (s *Suite) TestPeriodValidate() {
	err := s.repository.PeriodValidate("1d")
	require.Nil(s.T(), err)
}

func (s *Suite) TestPeriodValidateNotFoundNumber() {
	err := s.repository.PeriodValidate("d")

	require.Equal(s.T(), "Invalid period or interval: not found number", err.Error())
}

func (s *Suite) TestPeriodValidateNotFoundUnit() {
	err := s.repository.PeriodValidate("1")

	require.Equal(s.T(), "Invalid period or interval: not found unit", err.Error())
}

func (s *Suite) TestParseMetricsGroup() {
	stringReader := strings.NewReader(`{
    "name": "Metricas de teste2",
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
	// metrics := []metric.Metric{
	// 	{
	// 		BaseModel: util.BaseModel{ID: uuid.New(), CreatedAt: time.Now()},
	// 		Nickname:  "metric 1",
	// 		Query:     "test_query",
	// 		Condition: "EQUAL",
	// 		Filters:   []datasourcePKG.MetricFilter{},
	// 		Threshold: 3.0,
	// 	},
	// 	{
	// 		BaseModel: util.BaseModel{ID: uuid.New(), CreatedAt: time.Now()},
	// 		Nickname:  "metric 2",
	// 		Query:     "test_query_2",
	// 		Condition: "EQUAL",
	// 		Filters:   []datasourcePKG.MetricFilter{},
	// 		Threshold: 4.0,
	// 	},
	// }

	insertMetricGroups := []MetricsGroup{
		{
			Name:        "group 1",
			Metrics:     []metric.Metric{},
			CircleID:    uuid.New(),
			WorkspaceID: uuid.New(),
		},
		{
			Name:        "group 2",
			Metrics:     []metric.Metric{},
			CircleID:    uuid.New(),
			WorkspaceID: uuid.New(),
		},
	}

	for _, metricgroup := range insertMetricGroups {
		s.DB.Create(&metricgroup)
	}

	list, err := s.repository.FindAll()
	require.NoError(s.T(), err)

	require.NotEmpty(s.T(), list)
	for index, item := range list {
		insertMetricGroups[index].BaseModel = item.BaseModel
		require.Equal(s.T(), list, insertMetricGroups[index])
	}
}

// func (s *Suite) TestFindAllError() {
// 	id := uuid.New()
// 	timeNow := time.Now()
// 	var (
// 		name        = "test-name"
// 		workspaceID = uuid.New()
// 		status      = "ACTIVE"
// 		circleId    = uuid.New()
// 	)

// 	s.mock.MatchExpectationsInOrder(false)
// 	metricsGroupRows := sqlmock.
// 		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
// 		AddRow(id, name, workspaceID, status, circleId, timeNow)
// 	s.mock.ExpectQuery(regexp.QuoteMeta(
// 		`SELECT * FROM "metrics_groupss"`)).
// 		WillReturnRows(metricsGroupRows)

// 	_, err := s.repository.FindAll()

// 	require.Error(s.T(), err)
// }

// func (s *Suite) TestFindById() {
// 	id := uuid.New()
// 	timeNow := time.Now()
// 	var (
// 		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
// 		name        = "test-name"
// 		workspaceID = uuid.New()
// 		status      = "ACTIVE"
// 		circleId    = uuid.New()
// 	)
// 	var (
// 		metricId   = id
// 		metricName = "Metrictest"
// 		condition  = "test"
// 		threshold  = 1.2
// 	)
// 	var (
// 		field    = "circle_id"
// 		value    = "5c7979b7-51fd-4c16-8f2e-2c5d93651ed1"
// 		operator = "="
// 	)

// 	s.mock.MatchExpectationsInOrder(false)
// 	metricsGroupRows := sqlmock.
// 		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
// 		AddRow(id, name, workspaceID, status, circleId, timeNow)
// 	s.mock.ExpectQuery(regexp.QuoteMeta(
// 		`SELECT * FROM "metrics_groups"  WHERE (id = $1) ORDER BY "metrics_groups"."id" ASC LIMIT 1`)).
// 		WithArgs(id).
// 		WillReturnRows(metricsGroupRows)

// 	metricRows := sqlmock.
// 		NewRows([]string{"id", "metric", "threshold", "condition", "metrics_group_id", "data_source_id", "status", "created_at"}).
// 		AddRow(id, metricName, threshold, condition, id, id, status, timeNow)
// 	s.mock.ExpectQuery(regexp.QuoteMeta(
// 		`SELECT * FROM "metrics" WHERE ("metrics_group_id" IN ($1))`)).
// 		WithArgs(id).
// 		WillReturnRows(metricRows)

// 	metricFilterRows := sqlmock.
// 		NewRows([]string{"id", "field", "value", "operator", "metric_id", "created_at"}).
// 		AddRow(id, field, value, operator, metricId, timeNow)
// 	s.mock.ExpectQuery(regexp.QuoteMeta(
// 		`SELECT * FROM "metric_filters" WHERE ("metric_id" IN ($1))`)).
// 		WithArgs(metricId).
// 		WillReturnRows(metricFilterRows)

// 	metricGroupByRows := sqlmock.
// 		NewRows([]string{"id", "field", "metric_id", "created_at"}).
// 		AddRow(id, field, metricId, timeNow)
// 	s.mock.ExpectQuery(regexp.QuoteMeta(
// 		`SELECT * FROM "metric_group_bies" WHERE ("metric_id" IN ($1))`)).
// 		WithArgs(metricId).
// 		WillReturnRows(metricGroupByRows)

// 	res, err := s.repository.FindById(id.String())

// 	filterList := make([]datasourcePKG.MetricFilter, 0)
// 	groupByList := make([]metric.MetricGroupBy, 0)
// 	metricList := make([]metric.Metric, 0)

// 	metricFilter := datasourcePKG.MetricFilter{
// 		BaseModel: baseModel,
// 		MetricID:  metricId,
// 		Field:     field,
// 		Value:     value,
// 		Operator:  operator,
// 	}

// 	metricGroupBy := metric.MetricGroupBy{
// 		BaseModel: baseModel,
// 		MetricID:  metricId,
// 		Field:     field,
// 	}
// 	filterList = append(filterList, metricFilter)
// 	groupByList = append(groupByList, metricGroupBy)

// 	metric := metric.Metric{
// 		BaseModel:      baseModel,
// 		MetricsGroupID: id,
// 		DataSourceID:   id,
// 		Metric:         metricName,
// 		Filters:        filterList,
// 		GroupBy:        groupByList,
// 		Condition:      condition,
// 		Threshold:      threshold,
// 	}

// 	metricList = append(metricList, metric)

// 	metricGroup := MetricsGroup{
// 		BaseModel:   baseModel,
// 		Name:        name,
// 		Metrics:     metricList,
// 		WorkspaceID: workspaceID,
// 		CircleID:    circleId,
// 	}
// 	require.NoError(s.T(), err)
// 	require.Equal(s.T(), res, metricGroup)
// }

// func (s *Suite) TestFindByIdError() {
// 	id := uuid.New()
// 	timeNow := time.Now()
// 	var (
// 		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
// 		name        = "test-name"
// 		workspaceID = uuid.New()
// 		status      = "ACTIVE"
// 		circleId    = uuid.New()
// 	)
// 	var (
// 		metricId   = id
// 		metricName = "Metrictest"
// 		condition  = "test"
// 		threshold  = 1.2
// 	)
// 	var (
// 		field    = "circle_id"
// 		value    = "5c7979b7-51fd-4c16-8f2e-2c5d93651ed1"
// 		operator = "="
// 	)
// 	s.mock.MatchExpectationsInOrder(false)
// 	metricsGroupRows := sqlmock.
// 		NewRows([]string{"id", "name", "workspace_id", "status", "circle_id", "created_at"}).
// 		AddRow(id, name, workspaceID, status, circleId, timeNow)
// 	s.mock.ExpectQuery(regexp.QuoteMeta(
// 		`SELECT * FROM "ERROR"  WHERE (id = $1) ORDER BY "metrics_groups"."id" ASC LIMIT 1`)).
// 		WithArgs(id).
// 		WillReturnRows(metricsGroupRows)

// 	_, err := s.repository.FindById(id.String())

// 	filterList := make([]datasourcePKG.MetricFilter, 0)
// 	groupByList := make([]metric.MetricGroupBy, 0)
// 	metricList := make([]metric.Metric, 0)

// 	metricFilter := datasourcePKG.MetricFilter{
// 		BaseModel: baseModel,
// 		MetricID:  metricId,
// 		Field:     field,
// 		Value:     value,
// 		Operator:  operator,
// 	}

// 	metricGroupBy := metric.MetricGroupBy{
// 		BaseModel: baseModel,
// 		MetricID:  metricId,
// 		Field:     field,
// 	}
// 	filterList = append(filterList, metricFilter)
// 	groupByList = append(groupByList, metricGroupBy)

// 	metric := metric.Metric{
// 		BaseModel:      baseModel,
// 		MetricsGroupID: id,
// 		DataSourceID:   id,
// 		Metric:         metricName,
// 		Filters:        filterList,
// 		GroupBy:        groupByList,
// 		Condition:      condition,
// 		Threshold:      threshold,
// 	}

// 	metricList = append(metricList, metric)

// 	require.Error(s.T(), err)
// }

// func (s *Suite) TestRemove() {
// 	id := uuid.New()
// 	query := regexp.QuoteMeta(`DELETE FROM "metrics_groups"`)

// 	s.mock.MatchExpectationsInOrder(false)
// 	s.mock.ExpectBegin()
// 	s.mock.ExpectExec(query).
// 		WillReturnResult(sqlmock.NewResult(1, 1))
// 	s.mock.ExpectCommit()

// 	resErr := s.repository.Remove(id.String())

// 	require.NoError(s.T(), resErr)
// 	require.Nil(s.T(), resErr)
// }

// func (s *Suite) TestRemoveError() {
// 	id := uuid.New()
// 	query := regexp.QuoteMeta(`DELETE FROM "error"`)

// 	s.mock.MatchExpectationsInOrder(false)
// 	s.mock.ExpectBegin()
// 	s.mock.ExpectExec(query).
// 		WillReturnResult(sqlmock.NewResult(1, 1))
// 	s.mock.ExpectCommit()

// 	err := s.repository.Remove(id.String())

// 	require.Error(s.T(), err)
// }

// func (s *Suite) TestUpdateMetricsGroup() {
// 	id := uuid.New()

// 	metricsGroupStruct := MetricsGroup{
// 		BaseModel:   util.BaseModel{},
// 		Name:        "Metricas de teste222",
// 		Metrics:     nil,
// 		WorkspaceID: uuid.UUID{},
// 		CircleID:    id,
// 	}

// 	query := regexp.QuoteMeta(`UPDATE "metrics_groups"`)

// 	s.mock.MatchExpectationsInOrder(false)
// 	s.mock.ExpectBegin()
// 	s.mock.ExpectExec(query).
// 		WillReturnResult(sqlmock.NewResult(1, 1))
// 	s.mock.ExpectCommit()

// 	res, err := s.repository.Update(id.String(), metricsGroupStruct)

// 	require.NoError(s.T(), err)
// 	require.Equal(s.T(), metricsGroupStruct, res)
// }

// func (s *Suite) TestUpdateMetricsGroupError() {
// 	id := uuid.New()

// 	metricsGroupStruct := MetricsGroup{
// 		BaseModel:   util.BaseModel{},
// 		Name:        "Metricas de teste222",
// 		Metrics:     nil,
// 		WorkspaceID: uuid.UUID{},
// 		CircleID:    id,
// 	}

// 	query := regexp.QuoteMeta(`UPDATE "error"`)

// 	s.mock.MatchExpectationsInOrder(false)
// 	s.mock.ExpectBegin()
// 	s.mock.ExpectExec(query).
// 		WillReturnResult(sqlmock.NewResult(1, 1))
// 	s.mock.ExpectCommit()

// 	_, err := s.repository.Update(id.String(), metricsGroupStruct)

// 	require.Error(s.T(), err)
// }

// func (s *Suite) TestSaveMetricsGroup() {
// 	id := uuid.New()
// 	timeNow := time.Now()
// 	var (
// 		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
// 		name        = "test-name"
// 		workspaceID = uuid.New()
// 		circleId    = uuid.New()
// 	)
// 	var (
// 		metricName = "Metrictest"
// 		condition  = "test"
// 		threshold  = 1.2
// 	)

// 	metricList := make([]metric.Metric, 0)

// 	metric := metric.Metric{
// 		BaseModel: util.BaseModel{
// 			ID:        uuid.UUID{},
// 			CreatedAt: time.Time{},
// 		},
// 		MetricsGroupID: uuid.UUID{},
// 		DataSourceID:   id,
// 		Metric:         metricName,
// 		Condition:      condition,
// 		Threshold:      threshold,
// 	}

// 	metricList = append(metricList, metric)

// 	metricsGroupStruct := MetricsGroup{
// 		BaseModel:   baseModel,
// 		Name:        name,
// 		Metrics:     metricList,
// 		WorkspaceID: workspaceID,
// 		CircleID:    circleId,
// 	}
// 	metricsGroupQuery := regexp.QuoteMeta(`INSERT INTO "metrics_groups"`)
// 	metricsQuery := regexp.QuoteMeta(`INSERT INTO "metrics"`)

// 	s.mock.MatchExpectationsInOrder(false)
// 	s.mock.ExpectBegin()
// 	s.mock.ExpectQuery(metricsGroupQuery).
// 		WithArgs(sqlmock.AnyArg(), metricsGroupStruct.CreatedAt, metricsGroupStruct.Name, metricsGroupStruct.WorkspaceID, metricsGroupStruct.CircleID).
// 		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))

// 	s.mock.ExpectQuery(metricsQuery).
// 		WithArgs(sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg()).
// 		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
// 	s.mock.ExpectCommit()

// 	res, err := s.repository.Save(metricsGroupStruct)
// 	require.NoError(s.T(), err)
// 	require.Equal(s.T(), metricsGroupStruct, res)
// }

// func (s *Suite) TestSaveMetricsGroupError() {
// 	id := uuid.New()
// 	timeNow := time.Now()
// 	var (
// 		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
// 		name        = "test-name"
// 		workspaceID = uuid.New()
// 		circleId    = uuid.New()
// 	)
// 	var (
// 		metricName = "Metrictest"
// 		condition  = "test"
// 		threshold  = 1.2
// 	)

// 	metricList := make([]metric.Metric, 0)

// 	metric := metric.Metric{
// 		BaseModel: util.BaseModel{
// 			ID:        uuid.UUID{},
// 			CreatedAt: time.Time{},
// 		},
// 		MetricsGroupID: uuid.UUID{},
// 		DataSourceID:   id,
// 		Metric:         metricName,
// 		Condition:      condition,
// 		Threshold:      threshold,
// 	}

// 	metricList = append(metricList, metric)

// 	metricsGroupStruct := MetricsGroup{
// 		BaseModel:   baseModel,
// 		Name:        name,
// 		Metrics:     metricList,
// 		WorkspaceID: workspaceID,
// 		CircleID:    circleId,
// 	}
// 	metricsGroupQuery := regexp.QuoteMeta(`INSERT INTO "metrics_groups"`)

// 	s.mock.MatchExpectationsInOrder(false)
// 	s.mock.ExpectBegin()
// 	s.mock.ExpectQuery(metricsGroupQuery).
// 		WithArgs(sqlmock.AnyArg(), metricsGroupStruct.CreatedAt, metricsGroupStruct.Name, metricsGroupStruct.WorkspaceID, metricsGroupStruct.CircleID).
// 		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))

// 	_, err := s.repository.Save(metricsGroupStruct)
// 	require.Error(s.T(), err)
// }
