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
	plugin2 "github.com/ZupIT/charlescd/compass/internal/use_case/plugin"
	mocks "github.com/ZupIT/charlescd/compass/tests/mocks/repository"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type PluginSuite struct {
	suite.Suite
	listPlugin plugin2.ListPlugins
	pluginRep  *mocks.PluginRepository
}

func (p *PluginSuite) SetupSuite() {
	p.pluginRep = new(mocks.PluginRepository)
	p.listPlugin = plugin2.NewListPlugins(p.pluginRep)
}

func TestPluginSuite(t *testing.T) {
	suite.Run(t, new(PluginSuite))
}

func (p *PluginSuite) BeforeTest(suiteName, testName string) {
	p.SetupSuite()
}

func (p *PluginSuite) TestListPlugins() {
	listPlugins := newListPlugins()
	p.pluginRep.On("FindAll", mock.Anything).Return(listPlugins, nil)
	res, err := p.listPlugin.Execute("mock-type")

	require.NotNil(p.T(), res)
	require.Nil(p.T(), err)
}

func (p *PluginSuite) TestFindAllByWorkspaceError() {
	p.pluginRep.On("FindAll", mock.Anything).Return(
		[]domain.Plugin{},
	    logging.NewError("error", errors.New("some error"), nil))

	_, err := p.listPlugin.Execute("mock-type")
	require.Error(p.T(), err)
}

