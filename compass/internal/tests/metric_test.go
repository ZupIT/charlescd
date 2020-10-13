/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"compass/internal/configuration"
	"compass/internal/datasource"
	metricRepo "compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	datasourcePKG "compass/pkg/datasource"
	"encoding/json"
	"io/ioutil"
	"os"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteMetric struct {
	suite.Suite
	DB *gorm.DB

	repository metricRepo.UseCases
	metric     *metricRepo.Metric
}

func (s *SuiteMetric) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *SuiteMetric) BeforeTest(_, _ string) {
	var err error
	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)

	s.repository = metricRepo.NewMain(s.DB, datasourceMain, pluginMain)
	clearDatabase(s.DB)
}

func (s *SuiteMetric) AfterTest(_, _ string) {
	s.DB.Close()
}

func TestInitMetric(t *testing.T) {
	suite.Run(t, new(SuiteMetric))
}

func (s *SuiteMetric) TestValidateMetric() {
	filters := make([]datasourcePKG.MetricFilter, 0)
	filters = append(filters, datasourcePKG.MetricFilter{Field: BigString, Value: BigString, Operator: "="})

	groupBy := make([]metricRepo.MetricGroupBy, 0)
	groupBy = append(groupBy, metricRepo.MetricGroupBy{Field: BigString})

	metric := metricRepo.Metric{
		Nickname: BigString,
		Filters:  filters,
		GroupBy:  groupBy,
	}
	var errList = s.repository.Validate(metric)

	require.NotEmpty(s.T(), errList)
}

func (s *SuiteMetric) TestParse() {
	stringReader := strings.NewReader(`{
    "dataSourceId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7",
    "metricGroupId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7",
    "metric": "metric 213",
    "filters": [
        {
            "field": "destination",
            "value": "moove",
            "operator": "EQUAL"
        }
    ],
    "groupBy": [
        {
            "field": "app"
        }
    ],
    "condition": "EQUAL",
    "threshold": 30.0
}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.ParseMetric(stringReadCloser)

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *SuiteMetric) TestParseError() {
	stringReader := strings.NewReader(`{ "dataSourceId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7saldajsndas" }`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.ParseMetric(stringReadCloser)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestSaveMetric() {
	circleId := uuid.New()

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metricRepo.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	dataSource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)
	s.DB.Create(&metricgroup)

	metricStruct := metricRepo.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   dataSource.ID,
		Query:          "group_metric_example_2",
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	res, err := s.repository.SaveMetric(metricStruct)

	require.NoError(s.T(), err)

	metricStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), res, metricStruct)
}

func (s *SuiteMetric) TestUpdateMetric() {
	circleId := uuid.New()

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metricRepo.Metric{},
		CircleID:    circleId,
		WorkspaceID: uuid.New(),
	}

	dataSource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)
	s.DB.Create(&metricgroup)
	metricStruct := metricRepo.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   dataSource.ID,
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	s.DB.Create(&metricStruct)

	metricStruct.Metric = "Name"

	res, err := s.repository.UpdateMetric(metricStruct.ID.String(), metricStruct)

	require.NoError(s.T(), err)

	metricStruct.BaseModel = res.BaseModel
	metricStruct.MetricExecution.Status = res.MetricExecution.Status
	require.Equal(s.T(), metricStruct, res)
}

func (s *SuiteMetric) TestRemoveMetric() {
	id := uuid.New()

	resErr := s.repository.RemoveMetric(id.String())

	require.NoError(s.T(), resErr)
	require.Nil(s.T(), resErr)
}

func (s *SuiteMetric) TestFindMetricById() {
	circleId := uuid.New()

	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metricRepo.Metric{},
		CircleID:    circleId,
		WorkspaceID: uuid.New(),
	}

	dataSource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)
	s.DB.Create(&metricGroup)
	metricStruct := metricRepo.Metric{
		MetricsGroupID: metricGroup.ID,
		DataSourceID:   dataSource.ID,
		Metric:         "MetricName",
		Filters:        []datasourcePKG.MetricFilter{},
		GroupBy:        []metricRepo.MetricGroupBy{},
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	s.DB.Create(&metricStruct)

	res, err := s.repository.FindMetricById(metricStruct.ID.String())

	require.NoError(s.T(), err)

	metricStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), metricStruct, res)
}

func (s *SuiteMetric) TestSaveMetricError() {
	circleId := uuid.New()

	metricStruct := metricRepo.Metric{
		Query:     "group_metric_example_2",
		Metric:    "MetricName",
		Filters:   nil,
		GroupBy:   nil,
		Condition: "=",
		Threshold: 1,
		CircleID:  circleId,
	}

	_, err := s.repository.SaveMetric(metricStruct)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestUpdateMetricError() {
	circleId := uuid.New()

	metricStruct := metricRepo.Metric{
		Metric:    "MetricName",
		Filters:   nil,
		GroupBy:   nil,
		Condition: "=",
		Threshold: 1,
		CircleID:  circleId,
	}

	s.DB.Create(&metricStruct)

	metricStruct.Metric = "Name"

	_, err := s.repository.UpdateMetric(metricStruct.ID.String(), metricStruct)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestFindMetricByIdError() {

	_, err := s.repository.FindMetricById("any-id")

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestResultQueryGetPluginError() {
	circleId := uuid.New()

	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metricRepo.Metric{},
		CircleID:    circleId,
		WorkspaceID: uuid.New(),
	}

	dataSource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)
	s.DB.Create(&metricGroup)
	metricStruct := metricRepo.Metric{
		MetricsGroupID: metricGroup.ID,
		DataSourceID:   dataSource.ID,
		Metric:         "MetricName",
		Filters:        []datasourcePKG.MetricFilter{},
		GroupBy:        []metricRepo.MetricGroupBy{},
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	_, err := s.repository.ResultQuery(metricStruct)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestQueryGetPluginBySrcError() {
	circleId := uuid.New()

	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metricRepo.Metric{},
		CircleID:    circleId,
		WorkspaceID: uuid.New(),
	}

	dataSource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)
	s.DB.Create(&metricGroup)
	metricStruct := metricRepo.Metric{
		MetricsGroupID: metricGroup.ID,
		DataSourceID:   dataSource.ID,
		Metric:         "MetricName",
		Filters:        []datasourcePKG.MetricFilter{},
		GroupBy:        []metricRepo.MetricGroupBy{},
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	_, err := s.repository.Query(metricStruct, datasourcePKG.Period{Value: 13, Unit: "h"}, datasourcePKG.Period{Value: 1, Unit: "h"})

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestQueryDatasourceError() {
	metricStruct := metricRepo.Metric{
		MetricsGroupID: uuid.New(),
		DataSourceID:   uuid.New(),
		Metric:         "MetricName",
		Filters:        []datasourcePKG.MetricFilter{},
		GroupBy:        []metricRepo.MetricGroupBy{},
		Condition:      "=",
		Threshold:      1,
		CircleID:       uuid.New(),
	}

	_, err := s.repository.Query(metricStruct, datasourcePKG.Period{Value: 13, Unit: "h"}, datasourcePKG.Period{Value: 13, Unit: "h"})
	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestCountMetrics() {
	metrics := make([]metricRepo.Metric, 0)

	metricStruct := metricRepo.Metric{
		MetricsGroupID: uuid.New(),
		DataSourceID:   uuid.New(),
		Metric:         "MetricName",
		Filters:        []datasourcePKG.MetricFilter{},
		GroupBy:        []metricRepo.MetricGroupBy{},
		Condition:      "=",
		Threshold:      5,
		CircleID:       uuid.New(),
	}
	execution := metricRepo.MetricExecution{
		MetricID:  metricStruct.ID,
		LastValue: 5,
		Status:    "REACHED",
	}
	metricStruct.MetricExecution = execution
	metrics = append(metrics, metricStruct)

	configured, reached, all := s.repository.CountMetrics(metrics)

	require.Equal(s.T(), 1, all)
	require.Equal(s.T(), 1, reached)
	require.Equal(s.T(), 1, configured)
}

func (s *SuiteMetric) TestFindAllByGroup() {
	ds := newBasicDatasource()
	s.DB.Create(&ds)

	group1 := newBasicMetricGroup()
	group2 := newBasicMetricGroup()
	s.DB.Create(&group1)
	s.DB.Create(&group2)

	metric1 := newBasicMetric()
	metric1.DataSourceID = ds.ID
	metric1.MetricsGroupID = group1.ID

	metric2 := newBasicMetric()
	metric2.DataSourceID = ds.ID
	metric2.MetricsGroupID = group1.ID

	metric3 := newBasicMetric()
	metric3.DataSourceID = ds.ID
	metric3.MetricsGroupID = group2.ID

	s.DB.Create(&metric1)
	s.DB.Create(&metric2)
	s.DB.Create(&metric3)

	listedMetrics, err := s.repository.FindAllByGroup(group1.ID.String())

	require.NoError(s.T(), err)
	require.Len(s.T(), listedMetrics, 2)
	require.Equal(s.T(), metric1.ID, listedMetrics[0].ID)
	require.Equal(s.T(), metric2.ID, listedMetrics[1].ID)
}

func (s *SuiteMetric) TestFindAllByGroupError() {
	s.DB.Close()

	_, err := s.repository.FindAllByGroup(uuid.New().String())

	require.Error(s.T(), err)
}
