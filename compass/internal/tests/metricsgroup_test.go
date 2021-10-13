/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package tests

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"
	"testing"

	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	datasource2 "github.com/ZupIT/charlescd/compass/pkg/datasource"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteMetricGroup struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository metricsgroup.UseCases
}

func (s *SuiteMetricGroup) SetupSuite() {
	setupEnv()
}

func (s *SuiteMetricGroup) BeforeTest(_, _ string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)
	metricMain := metric.NewMain(s.DB, datasourceMain, pluginMain)
	actionMain := action.NewMain(s.DB, pluginMain)
	groupActionMain := metricsgroupaction.NewMain(s.DB, pluginMain, actionMain)
	s.repository = metricsgroup.NewMain(s.DB, metricMain, datasourceMain, pluginMain, groupActionMain)

	clearDatabase(s.DB)
}

func (s *SuiteMetricGroup) AfterTest(_, _ string) {
	s.DB.Close()
}

func TestInitMetricGroup(t *testing.T) {
	suite.Run(t, new(SuiteMetricGroup))
}

func (s *SuiteMetricGroup) TestValidate() {
	newMetricGroup := newBasicMetricGroup()

	errList := s.repository.Validate(newMetricGroup)
	fmt.Println(errList)
	require.Empty(s.T(), errList)
}

func (s *SuiteMetricGroup) TestValidateEmptyName() {
	newMetricGroup := newBasicMetricGroup()
	newMetricGroup.Name = ""

	ers := s.repository.Validate(newMetricGroup)

	require.Len(s.T(), ers.Get().Errors, 1)
	require.Equal(s.T(), "Name is required", ers.Get().Errors[0].Error().Detail)
}

func (s *SuiteMetricGroup) TestValidateBlankName() {
	newMetricGroup := newBasicMetricGroup()
	newMetricGroup.Name = "    "

	ers := s.repository.Validate(newMetricGroup)

	require.Len(s.T(), ers.Get().Errors, 1)
	require.Equal(s.T(), "Name is required", ers.Get().Errors[0].Error().Detail)
}

func (s *SuiteMetricGroup) TestValidateNameLength() {
	newMetricGroup := newBasicMetricGroup()
	newMetricGroup.Name = bigString

	ers := s.repository.Validate(newMetricGroup)

	require.Len(s.T(), ers.Get().Errors, 1)
	require.Equal(s.T(), "64 Maximum length in Name", ers.Get().Errors[0].Error().Detail)
}

func (s *SuiteMetricGroup) TestValidateNilCircle() {
	newMetricGroup := newBasicMetricGroup()
	newMetricGroup.CircleID = uuid.Nil

	ers := s.repository.Validate(newMetricGroup)

	require.Len(s.T(), ers.Get().Errors, 1)
	require.Equal(s.T(), "CircleID is required", ers.Get().Errors[0].Error().Detail)
}

func (s *SuiteMetricGroup) TestValidateNilWorkspaceID() {
	newMetricGroup := newBasicMetricGroup()
	newMetricGroup.WorkspaceID = uuid.Nil

	ers := s.repository.Validate(newMetricGroup)

	require.Len(s.T(), ers.Get().Errors, 1)
	require.Equal(s.T(), "WorkspaceID is required", ers.Get().Errors[0].Error().Detail)
}

func (s *SuiteMetricGroup) TestParseMetricsGroup() {
	stringReader := strings.NewReader(`{
    "name": "Metricas de teste2",
    "circleId": "b9d285fc-542b-4828-9e30-d28355b5fefb"
	}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.Parse(stringReadCloser)

	require.Nil(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *SuiteMetricGroup) TestParseMetricsGroupError() {
	stringReader := strings.NewReader(`{ERROR}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.Parse(stringReadCloser)
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestPeriodValidate() {
	_, err := s.repository.PeriodValidate("1d")
	require.Nil(s.T(), err)
}

func (s *SuiteMetricGroup) TestPeriodValidateNotFoundNumber() {
	_, err := s.repository.PeriodValidate("d")

	require.Equal(s.T(), "Invalid period or interval: not found number", err.Error().Detail)
}

func (s *SuiteMetricGroup) TestPeriodValidateNotFoundUnit() {
	_, err := s.repository.PeriodValidate("1")

	require.Equal(s.T(), "Invalid period or interval: not found unit", err.Error().Detail)
}

func (s *SuiteMetricGroup) TestFindAll() {
	group1 := newBasicMetricGroup()
	group1.Name = "group 1"

	group2 := newBasicMetricGroup()
	group2.Name = "group 2"

	expectMetricGroups := []metricsgroup.MetricsGroup{group1, group2}

	for _, metricGroup := range expectMetricGroups {
		s.DB.Create(&metricGroup)
	}

	list, err := s.repository.FindAll()
	require.Nil(s.T(), err)

	require.NotEmpty(s.T(), list)
	for index, item := range list {
		expectMetricGroups[index].BaseModel = item.BaseModel
		require.Equal(s.T(), item.ID, expectMetricGroups[index].ID)
	}
}

func (s *SuiteMetricGroup) TestFindAllError() {
	s.DB.Close()

	_, err := s.repository.FindAll()
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestFindAllByWorkspaceId() {
	group1 := newBasicMetricGroup()
	group1.Name = "group 1"

	group2 := newBasicMetricGroup()
	group2.Name = "group 2"
	group2.WorkspaceID = group1.WorkspaceID

	expectMetricGroups := []metricsgroup.MetricsGroup{group1, group2}

	for _, metricGroup := range expectMetricGroups {
		s.DB.Create(&metricGroup)
	}

	list, err := s.repository.FindAllByWorkspaceID(group1.WorkspaceID)
	require.Nil(s.T(), err)

	require.NotEmpty(s.T(), list)
	for index, item := range list {
		expectMetricGroups[index].BaseModel = item.BaseModel
		require.Equal(s.T(), item.ID, expectMetricGroups[index].ID)
	}
}

func (s *SuiteMetricGroup) TestFindAllByWorkspaceIdError() {
	s.DB.Close()

	_, err := s.repository.FindAllByWorkspaceID(uuid.New())
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestMetricsGroupFindById() {
	metricGroup := newBasicMetricGroup()

	s.DB.Create(&metricGroup)

	item, err := s.repository.FindByID(metricGroup.ID.String())
	require.Nil(s.T(), err)

	metricGroup.BaseModel = item.BaseModel
	require.Equal(s.T(), item.ID, metricGroup.ID)
}

func (s *SuiteMetricGroup) TestSave() {
	metricGroup := newBasicMetricGroup()

	createMetricGroup, err := s.repository.Save(metricGroup)
	require.Nil(s.T(), err)

	metricGroup.BaseModel = createMetricGroup.BaseModel
	require.Equal(s.T(), createMetricGroup, metricGroup)
}

func (s *SuiteMetricGroup) TestSaveError() {
	metricGroup := newBasicMetricGroup()

	s.DB.Close()
	_, err := s.repository.Save(metricGroup)
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestUpdate() {
	metricGroup := newBasicMetricGroup()

	s.DB.Create(&metricGroup)

	metricGroup.Name = "group 2"
	metricGroup.CircleID = uuid.New()
	createMetricGroup, err := s.repository.Update(metricGroup.ID.String(), metricGroup)
	require.Nil(s.T(), err)

	metricGroup.BaseModel = createMetricGroup.BaseModel
	require.Equal(s.T(), createMetricGroup, metricGroup)
}

func (s *SuiteMetricGroup) TestUpdateError() {
	metricGroup := newBasicMetricGroup()

	s.DB.Create(&metricGroup)
	metricGroup.Name = "group 2"
	metricGroup.CircleID = uuid.New()
	s.DB.Close()

	_, err := s.repository.Update(metricGroup.ID.String(), metricGroup)
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestUpdateName() {
	metricGroup := newBasicMetricGroup()

	s.DB.Create(&metricGroup)

	newName := "group 2"
	metricGroup.Name = newName
	createMetricGroup, err := s.repository.UpdateName(metricGroup.ID.String(), metricGroup)

	require.Nil(s.T(), err)
	require.Equal(s.T(), createMetricGroup.Name, newName)
}

func (s *SuiteMetricGroup) TestUpdateNameError() {
	metricGroup := newBasicMetricGroup()

	s.DB.Create(&metricGroup)

	newName := "group 2"
	metricGroup.Name = newName
	s.DB.Close()
	_, err := s.repository.UpdateName(metricGroup.ID.String(), metricGroup)

	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestDelete() {
	metricGroup := newBasicMetricGroup()

	s.DB.Create(&metricGroup)

	err := s.repository.Remove(metricGroup.ID.String())
	require.Nil(s.T(), err)
}

func (s *SuiteMetricGroup) TestDeleteError() {
	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	s.DB.Close()
	err := s.repository.Remove(metricgroup.ID.String())
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestFindCircleMetricGroups() {
	circleID := uuid.New()
	metricgroup1 := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
		Actions:     []metricsgroupaction.MetricsGroupAction{},
	}

	metricgroup2 := metricsgroup.MetricsGroup{
		Name:        "group 2",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
		Actions:     []metricsgroupaction.MetricsGroupAction{},
	}

	metricgroup3 := metricsgroup.MetricsGroup{
		Name:        "group 3",
		Metrics:     []metric.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
		Actions:     []metricsgroupaction.MetricsGroupAction{},
	}

	s.DB.Create(&metricgroup1)
	s.DB.Create(&metricgroup2)
	s.DB.Create(&metricgroup3)

	res, err := s.repository.ListAllByCircle(circleID.String())
	require.Nil(s.T(), err)
	require.Len(s.T(), res, 2)
}

func (s *SuiteMetricGroup) TestFindCircleMetricGroupsError() {
	s.DB.Close()
	_, err := s.repository.ListAllByCircle(uuid.New().String())
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestFindByIdError() {
	s.DB.Close()
	_, err := s.repository.FindByID("any-id")
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestResumeByCircle() {
	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricgroup)

	metric1 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName1",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleID,
	}

	metric2 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName2",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      5,
		CircleID:       circleID,
	}

	s.DB.Create(&metric1)
	s.DB.Create(&metric2)

	expectedGroupResume := []metricsgroup.MetricGroupResume{
		{
			Name:              metricgroup.Name,
			Thresholds:        2,
			ThresholdsReached: 0,
			Metrics:           2,
			Status:            "ACTIVE",
		},
	}

	groupsResume, err := s.repository.ResumeByCircle(circleID.String())
	require.Nil(s.T(), err)

	for index, resume := range groupsResume {
		expectedGroupResume[index].BaseModel = resume.BaseModel
		require.Equal(s.T(), expectedGroupResume[index], resume)
	}
}

func (s *SuiteMetricGroup) TestResumeByCircleError() {
	s.DB.Close()
	_, err := s.repository.ResumeByCircle("")
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestQueryByGroupIDErrorNotFoundPlugin() {
	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricgroup)

	metric1 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName1",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleID,
	}

	metric2 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName2",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      5,
		CircleID:       circleID,
	}

	s.DB.Create(&metric1)
	s.DB.Create(&metric2)

	_, err := s.repository.QueryByGroupID(metricgroup.ID.String(), datasource2.Period{Value: 5, Unit: "d"}, datasource2.Period{Value: 30, Unit: "m"})
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestQueryByGroupIDDatabaseError() {
	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "datasource/prometheus/prometheus",
		Data:        json.RawMessage(`{"url": "http://localhost:9090"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricgroup)

	s.DB.Close()
	_, err := s.repository.QueryByGroupID(metricgroup.ID.String(), datasource2.Period{Value: 5, Unit: "d"}, datasource2.Period{Value: 30, Unit: "m"})
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestResultByGroupErrorNotFoundPlugin() {
	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricgroup)

	metric1 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName1",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleID,
	}

	metric2 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName2",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      5,
		CircleID:       circleID,
	}

	s.DB.Create(&metric1)
	s.DB.Create(&metric2)

	metricgroup.Metrics = []metric.Metric{
		metric1,
		metric2,
	}

	_, err := s.repository.ResultByGroup(metricgroup)
	require.NotNil(s.T(), err)
}

func (s *SuiteMetricGroup) TestResultByIdError() {
	s.DB.Close()
	_, err := s.repository.ResultByID("someId")

	require.NotNil(s.T(), err)
	require.Equal(s.T(), "Not found metrics group: someId", err.Error().Detail)
}
