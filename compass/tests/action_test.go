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
	action2 "github.com/ZupIT/charlescd/compass/internal/use_case/action"
	mocks "github.com/ZupIT/charlescd/compass/tests/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type ActionSuite struct {
	suite.Suite
	listAction   action2.ListAction
	deleteAction action2.DeleteAction
	createAction action2.CreateAction
	actionRep    *mocks.ActionRepository
	pluginRep    *mocks.PluginRepository

}

func (a *ActionSuite) SetupSuite() {
	a.actionRep = new(mocks.ActionRepository)
	a.pluginRep = new(mocks.PluginRepository)
	a.listAction = action2.NewListAction(a.actionRep)
	a.deleteAction = action2.NewDeleteAction(a.actionRep)
	a.createAction = action2.NewCreateAction(a.actionRep, a.pluginRep)
}

func (a *ActionSuite) BeforeTest(_, _ string) {
	a.SetupSuite()
}


func TestActionsSuite(t *testing.T) {
	suite.Run(t, new(ActionSuite))
}

func (a *ActionSuite) TestFindAllByWorkspace() {
	a.actionRep.On("FindAllActionsByWorkspace", mock.Anything).Return([]domain.Action{}, nil)
	r, err := a.listAction.Execute(uuid.New())

	require.NotNil(a.T(), r)
	require.Nil(a.T(), err)
}

func (a *ActionSuite) TestFindAllByWorkspaceError() {
	a.actionRep.On("FindAllActionsByWorkspace", mock.Anything).Return(
		[]domain.Action{},
		logging.NewError("error", errors.New("some error"), nil))

	_ , err := a.listAction.Execute(uuid.New())
	require.Error(a.T(), err)
}


func (a *ActionSuite) TestDelete() {
	a.actionRep.On("DeleteAction", mock.Anything).Return( nil)
	err := a.deleteAction.Execute(uuid.New())

	require.Nil(a.T(), err)
}

func (a *ActionSuite) TestDeleteError() {
	a.actionRep.On("DeleteAction", mock.Anything).Return(
		logging.NewError("error", errors.New("some error"), nil))

	err := a.deleteAction.Execute(uuid.New())
	require.Error(a.T(), err)
}
