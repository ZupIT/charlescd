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
	metric2 "github.com/ZupIT/charlescd/compass/internal/use_case/metric"
	mocks "github.com/ZupIT/charlescd/compass/tests/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type MetricSuite struct {
	suite.Suite
	deleteMetric   metric2.DeleteMetric
	createMetric   metric2.CreateMetric
	updateMetric   metric2.UpdateMetric
	metricRep      *mocks.MetricRepository
	metricGroupRep *mocks.MetricsGroupRepository
}

func (m *MetricSuite) SetupSuite() {
	m.metricRep = new(mocks.MetricRepository)
	m.metricGroupRep = new(mocks.MetricsGroupRepository)
	m.deleteMetric = metric2.NewDeleteMetric(m.metricRep)
	m.createMetric = metric2.NewCreateMetric(m.metricRep, m.metricGroupRep)
	m.updateMetric = metric2.NewUpdateMetric(m.metricRep)
}

func TestMetricSuite(t *testing.T) {
	suite.Run(t, new(MetricSuite))
}

func (m *MetricSuite) BeforeTest(suiteName, testName string) {
	m.SetupSuite()
}

func (m *MetricSuite) TestCreateMetric() {

	metricCreate := newBasicMetric()
	var r float64
	m.metricGroupRep.On("FindById", mock.Anything).Return(domain.MetricsGroup{}, nil)
	m.metricRep.On("ResultQuery", mock.Anything).Return(r, nil)
	m.metricRep.On("SaveMetric", mock.Anything).Return(metricCreate, nil)
	res, err := m.createMetric.Execute(metricCreate)

	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)

	metricCreate.BaseModel = res.BaseModel
	require.Equal(m.T(), metricCreate.BaseModel, res.BaseModel)
	require.Equal(m.T(), metricCreate.Nickname, res.Nickname)
	require.Equal(m.T(), metricCreate.CircleID, res.CircleID)
}

func (m *MetricSuite) TestCreateMetricError() {

	var r float64
	m.metricGroupRep.On("FindById", mock.Anything).Return(domain.MetricsGroup{}, nil)
	m.metricRep.On("ResultQuery", mock.Anything).Return(r, nil)
	m.metricRep.On("SaveMetric", mock.Anything).Return(domain.Metric{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.createMetric.Execute(domain.Metric{})

	require.Error(m.T(), err)
}

func (m *MetricSuite) TestCreateMetricFindGroupError() {
	m.metricGroupRep.On("FindById", mock.Anything).Return(domain.MetricsGroup{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.createMetric.Execute(domain.Metric{})
	require.Error(m.T(), err)
}

func (m *MetricSuite) TestCreateMetricResultQuertError() {
	var r float64
	m.metricGroupRep.On("FindById", mock.Anything).Return(domain.MetricsGroup{}, nil)
	m.metricRep.On("ResultQuery", mock.Anything).Return(r, logging.NewError("error", errors.New("some error"), nil))
	_, err := m.createMetric.Execute(domain.Metric{})
	require.Error(m.T(), err)
}

func (m *MetricSuite) TestUpdateMetric() {
	metricCreate := newBasicMetric()
	var r float64
	m.metricRep.On("ResultQuery", mock.Anything).Return(r, nil)
	m.metricRep.On("UpdateMetric", mock.Anything).Return(metricCreate, nil)
	res, err := m.updateMetric.Execute(metricCreate)

	require.Nil(m.T(), err)

	metricCreate.BaseModel = res.BaseModel
	require.Equal(m.T(), metricCreate.BaseModel, res.BaseModel)
	require.Equal(m.T(), metricCreate.CircleID, res.CircleID)
}

func (m *MetricSuite) TestUpdateMetricError() {
	var r float64
	m.metricRep.On("ResultQuery", mock.Anything).Return(r, nil)
	m.metricRep.On("UpdateMetric", mock.Anything).Return(domain.Metric{},
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.updateMetric.Execute(domain.Metric{})

	require.Error(m.T(), err)
}

func (m *MetricSuite) TestUpdateMetricResultQueryError() {
	var r float64
	m.metricRep.On("ResultQuery", mock.Anything).Return(r,
		logging.NewError("error", errors.New("some error"), nil))
	_, err := m.updateMetric.Execute(domain.Metric{})

	require.Error(m.T(), err)
}

func (m *MetricSuite) TestDeleteMetric() {
	workspaceId := uuid.New()

	m.metricRep.On("RemoveMetric", mock.Anything).Return(nil)
	err := m.deleteMetric.Execute(workspaceId)

	require.Nil(m.T(), err)
}

func (m *MetricSuite) TestDeleteMetricError() {
	workspaceId := uuid.New()

	m.metricRep.On("RemoveMetric", mock.Anything).Return(logging.NewError("error", errors.New("some error"), nil))
	err := m.deleteMetric.Execute(workspaceId)

	require.Error(m.T(), err)
}
