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
	"github.com/ZupIT/charlescd/compass/internal/logging"
	metricsGroupAction2 "github.com/ZupIT/charlescd/compass/internal/use_case/metrics_group_action"
	mocks "github.com/ZupIT/charlescd/compass/tests/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type MetricsGroupActionSuite struct {
	suite.Suite
	findMetricsGroupAction   metricsGroupAction2.FindMetricsGroupActionById
	deleteMetricsGroupAction metricsGroupAction2.DeleteMetricsGroupAction
	createMetricsGroupAction metricsGroupAction2.CreateMetricGroupAction
	updateMetricsGroupAction metricsGroupAction2.UpdateMetricGroupAction
	metricsGroupActionRep    *mocks.MetricsGroupActionRepository
	actionRep                *mocks.ActionRepository
	pluginRep                *mocks.PluginRepository

}

func (m *MetricsGroupActionSuite) SetupSuite() {
	m.metricsGroupActionRep = new(mocks.MetricsGroupActionRepository)
	m.actionRep = new(mocks.ActionRepository)
	m.pluginRep = new(mocks.PluginRepository)
	m.findMetricsGroupAction = metricsGroupAction2.NewFindMetricsGroupActionById(m.metricsGroupActionRep)
	m.deleteMetricsGroupAction = metricsGroupAction2.NewDeleteMetricsGroupAction(m.metricsGroupActionRep)
	m.createMetricsGroupAction = metricsGroupAction2.NewCreateMetricsGroupAction(m.metricsGroupActionRep, m.actionRep, m.pluginRep)
	m.updateMetricsGroupAction = metricsGroupAction2.NewUpdateMetricsGroupAction(m.metricsGroupActionRep, m.actionRep, m.pluginRep)
}

func TestMetricsGroupActionSuite(t *testing.T) {
	suite.Run(t, new(MetricsGroupActionSuite))
}

func (m *MetricsGroupActionSuite) BeforeTest(suiteName, testName string) {
	m.SetupSuite()
}

func (m *MetricsGroupActionSuite) TestFindById() {
	metricGroupAction := newBasicMetricsGroupAction()
	m.metricsGroupActionRep.On("FindGroupActionById", mock.Anything).Return(metricGroupAction, nil)
	res, err := m.findMetricsGroupAction.Execute(metricGroupAction.ID)

	require.NotNil(m.T(), res)
	require.Nil(m.T(), err)
}

func (m *MetricsGroupActionSuite) TestFindByIdError() {
	metricGroupAction := newBasicMetricsGroupAction()
	m.metricsGroupActionRep.On("FindGroupActionById", mock.Anything).Return(
		metricGroupAction,
		logging.NewError("error", errors.New("some error"), nil))

	_, err := m.findMetricsGroupAction.Execute(uuid.New())
	require.Error(m.T(), err)
}

func (m *MetricsGroupActionSuite) TestDeleteMetricsGroupAction() {
	workspaceId := uuid.New()

	m.metricsGroupActionRep.On("DeleteGroupAction", mock.Anything).Return( nil)
	err := m.deleteMetricsGroupAction.Execute(workspaceId)

	require.Nil(m.T(), err)
}

func (m *MetricsGroupActionSuite) TestDeleteMetricsGroupActionError() {
	workspaceId := uuid.New()

	m.metricsGroupActionRep.On("DeleteGroupAction", mock.Anything).Return( logging.NewError("error", errors.New("some error"), nil))
	err := m.deleteMetricsGroupAction.Execute(workspaceId)

	require.Error(m.T(), err)
}


