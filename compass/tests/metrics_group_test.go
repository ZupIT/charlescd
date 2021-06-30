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
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	metricsGroup2 "github.com/ZupIT/charlescd/compass/internal/use_case/metrics_group"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	mocks "github.com/ZupIT/charlescd/compass/tests/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type MetricsGroupSuite struct {
	suite.Suite
	createMetricsGroup 		 metricsGroup2.CreateMetricsGroup
	deleteMetricsGroup 		 metricsGroup2.DeleteMetricsGroup
	findMetricsGroup   		 metricsGroup2.FindAllMetricsGroup
	getMetricsGroup    		 metricsGroup2.GetMetricsGroup
	listMetricsGroupByCircle metricsGroup2.ListMetricGroupByCircle
	queryMetricsGroup 		 metricsGroup2.QueryMetricsGroup
	resultMetrics            metricsGroup2.ResultMetrics
	resumeByCircle           metricsGroup2.ResumeByCircleMetricsGroup
	updateMetricsGroup       metricsGroup2.UpdateNameMetricsGroup
	updateNameMetricsGroup   metricsGroup2.UpdateNameMetricsGroup
	metricsGroupRep          *mocks.MetricsGroupRepository
}

func (m *MetricsGroupSuite) SetupSuite() {
	m.metricsGroupRep = new(mocks.MetricsGroupRepository)
	m.createMetricsGroup = metricsGroup2.NewCreateMetricsGroup(m.metricsGroupRep)
	m.deleteMetricsGroup = metricsGroup2.NewDeleteMetricsGroup(m.metricsGroupRep)
	m.findMetricsGroup = metricsGroup2.NewFindAllMetricsGroup(m.metricsGroupRep)
	m.getMetricsGroup  = metricsGroup2.NewGetMetricsGroup(m.metricsGroupRep)
	m.listMetricsGroupByCircle = metricsGroup2.NewListMetricGroupByCircle(m.metricsGroupRep)
	m.queryMetricsGroup = metricsGroup2.NewQueryMetricsGroup(m.metricsGroupRep)
	m.resultMetrics = metricsGroup2.NewResultMetrics(m.metricsGroupRep)
	m.resumeByCircle = metricsGroup2.NewResumeByCircleMetricsGroup(m.metricsGroupRep)
	m.updateMetricsGroup = metricsGroup2.NewUpdateMetricsGroup(m.metricsGroupRep)
	m.updateNameMetricsGroup = metricsGroup2.NewUpdateNameMetricsGroup(m.metricsGroupRep)
}

func TestMetricsGroupSuite(t *testing.T) {
	suite.Run(t, new(MetricsGroupSuite))
}

func (m *MetricsGroupSuite) BeforeTest(suiteName, testName string) {
	m.SetupSuite()
}


func (m *MetricsGroupSuite) TestCreateMetricsGroup() {
	metricGroupAction := newBasicMetricsGroup()
	m.metricsGroupRep.On("Save", mock.Anything).Return(metricGroupAction, nil)
	res, err := m.createMetricsGroup.Execute(metricGroupAction)

	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestCreateMetricsGroupError() {
	metricGroupAction := newBasicMetricsGroup()
	m.metricsGroupRep.On("Save", mock.Anything).Return(metricGroupAction,
		logging.NewError("error", errors.New("some error"), nil))

	_, err := m.createMetricsGroup.Execute(metricGroupAction)

	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestDeleteMetricsGroup() {
	workspaceId := uuid.New()

	m.metricsGroupRep.On("Remove", mock.Anything).Return( nil)
	err := m.deleteMetricsGroup.Execute(workspaceId)

	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestDeleteMetricsGroupError() {
	workspaceId := uuid.New()

	m.metricsGroupRep.On("Remove", mock.Anything).Return( logging.NewError("error", errors.New("some error"), nil))
	err := m.deleteMetricsGroup.Execute(workspaceId)

	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestFindAllMetrics() {

	m.metricsGroupRep.On("FindAllByWorkspaceId", mock.Anything).Return([]domain.MetricsGroup{}, nil)
	res, err := m.findMetricsGroup.Execute(uuid.New())
	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestFindAllMetricsGroupError() {

	m.metricsGroupRep.On("FindAllByWorkspaceId", mock.Anything).Return([]domain.MetricsGroup{},
		logging.NewError("error", errors.New("some error"), nil))

	_, err := m.findMetricsGroup.Execute(uuid.New())
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestGetMetricsGroup() {
    metricsGroup := newBasicMetricsGroup()
	m.metricsGroupRep.On("FindById", mock.Anything).Return(metricsGroup, nil)
	res, err := m.getMetricsGroup.Execute(uuid.New())
	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestGetMetricsGroupError() {
	m.metricsGroupRep.On("FindById", mock.Anything).Return(domain.MetricsGroup{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.getMetricsGroup.Execute(uuid.New())
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestListMetricsGroupByCircle() {
	m.metricsGroupRep.On("ListAllByCircle", mock.Anything).Return([]domain.MetricsGroupRepresentation{}, nil)
	res, err := m.listMetricsGroupByCircle.Execute(uuid.New())
	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestListMetricsGroupByCircleError() {
	m.metricsGroupRep.On("ListAllByCircle", mock.Anything).Return([]domain.MetricsGroupRepresentation{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.listMetricsGroupByCircle.Execute(uuid.New())
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestQueryMetricsGroup() {
	m.metricsGroupRep.On("PeriodValidate", mock.Anything).Return(datasource.Period{}, nil)
	m.metricsGroupRep.On("QueryByGroupID", mock.Anything, mock.Anything, mock.Anything).Return([]domain.MetricValues{}, nil)
	res, err := m.queryMetricsGroup.Execute(uuid.New(), "1d", "1d")
	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestQueryMetricsGroupInvalidParametersError() {

	m.metricsGroupRep.On("QueryByGroupID", mock.Anything).Return([]domain.MetricValues{}, nil)
	_, err := m.queryMetricsGroup.Execute(uuid.New(), "", "")
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestQueryMetricsGroupIntervalError() {
	interval := "1a"
	period := "1d"
	m.metricsGroupRep.On("PeriodValidate", period ).Return(datasource.Period{}, nil)
	m.metricsGroupRep.On("PeriodValidate", interval).Return(datasource.Period{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.queryMetricsGroup.Execute(uuid.New(), period, interval)
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestQueryMetricsPeriodGroupError() {
	interval := "1a"
	period := "1d"
	m.metricsGroupRep.On("PeriodValidate", interval ).Return(datasource.Period{}, nil)
	m.metricsGroupRep.On("PeriodValidate", period).Return(datasource.Period{},
		logging.NewError("error", errors.New("some error"), nil))

	_, err := m.queryMetricsGroup.Execute(uuid.New(), period, interval)
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestQueryMetricsGroupError() {
	m.metricsGroupRep.On("PeriodValidate", mock.Anything).Return(datasource.Period{}, nil)
	m.metricsGroupRep.On("QueryByGroupID", mock.Anything,mock.Anything,mock.Anything).Return([]domain.MetricValues{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.queryMetricsGroup.Execute(uuid.New(), "1d", "1d")
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestResultMetrics() {
	m.metricsGroupRep.On("ResultByID", mock.Anything).Return([]domain.MetricResult{}, nil)
	res, err := m.resultMetrics.Execute(uuid.New())
	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestResultMetricsError() {
	m.metricsGroupRep.On("ResultByID", mock.Anything).Return([]domain.MetricResult{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.resultMetrics.Execute(uuid.New())
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestResumeByCircle() {
	m.metricsGroupRep.On("ResumeByCircle", mock.Anything).Return([]domain.MetricGroupResume{}, nil)
	res, err := m.resumeByCircle.Execute(uuid.New())
	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestResumeByCircleError() {
	m.metricsGroupRep.On("ResumeByCircle", mock.Anything).Return([]domain.MetricGroupResume{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.resumeByCircle.Execute(uuid.New())
	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestUpdateMetricsGroup() {
	metricGroup := newBasicMetricsGroup()
	m.metricsGroupRep.On("Update", mock.Anything, mock.Anything).Return(metricGroup, nil)
	res, err := m.updateMetricsGroup.Execute(uuid.New(), metricGroup)

	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestUpdateMetricsGroupError() {
	metricGroupAction := newBasicMetricsGroup()
	m.metricsGroupRep.On("Update", mock.Anything, mock.Anything).Return(metricGroupAction,
		logging.NewError("error", errors.New("some error"), nil))

	_, err := m.updateMetricsGroup.Execute(uuid.New(),metricGroupAction)

	require.Error(m.T(), err)
}

func (m *MetricsGroupSuite) TestUpdateNameMetricsGroup() {
	metricGroup := newBasicMetricsGroup()
	m.metricsGroupRep.On("UpdateName", mock.Anything, mock.Anything).Return(metricGroup, nil)
	res, err := m.updateNameMetricsGroup.Execute(uuid.New(), metricGroup)

	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupSuite) TestUpdateNameMetricsGroupError() {
	metricGroupAction := newBasicMetricsGroup()
	m.metricsGroupRep.On("UpdateName", mock.Anything, mock.Anything).Return(metricGroupAction,
		logging.NewError("error", errors.New("some error"), nil))

	_, err := m.updateNameMetricsGroup.Execute(uuid.New(),metricGroupAction)

	require.Error(m.T(), err)
}
