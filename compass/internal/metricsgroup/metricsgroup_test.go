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
	expectMetricGroups := []MetricsGroup{
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

	for _, metricgroup := range expectMetricGroups {
		s.DB.Create(&metricgroup)
	}

	list, err := s.repository.FindAll()
	require.NoError(s.T(), err)

	require.NotEmpty(s.T(), list)
	for index, item := range list {
		expectMetricGroups[index].BaseModel = item.BaseModel
		require.Equal(s.T(), item, expectMetricGroups[index])
	}
}

func (s *Suite) TestFindById() {
	metricgroup := MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	item, err := s.repository.FindById(metricgroup.ID.String())
	require.NoError(s.T(), err)

	metricgroup.BaseModel = item.BaseModel
	require.Equal(s.T(), item, metricgroup)
}

func (s *Suite) TestSave() {
	metricgroup := MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	createMetricGroup, err := s.repository.Save(metricgroup)
	require.NoError(s.T(), err)

	metricgroup.BaseModel = createMetricGroup.BaseModel
	require.Equal(s.T(), createMetricGroup, metricgroup)
}

func (s *Suite) TestUpdate() {
	metricgroup := MetricsGroup{
		Name:        "group 1",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	metricgroup.Name = "group 2"
	createMetricGroup, err := s.repository.Update(metricgroup.ID.String(), metricgroup)
	require.NoError(s.T(), err)

	metricgroup.BaseModel = createMetricGroup.BaseModel
	require.Equal(s.T(), createMetricGroup, metricgroup)
}

func (s *Suite) TestDelete() {
	metricgroup := MetricsGroup{
		Name:        "group 1",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	err := s.repository.Remove(metricgroup.ID.String())
	require.NoError(s.T(), err)
}
