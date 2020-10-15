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
	"compass/internal/action"
	"compass/internal/configuration"
	"compass/internal/plugin"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"io/ioutil"
	"os"
	"strings"
	"testing"
)

type ActionSuite struct {
	suite.Suite
	DB *gorm.DB

	repository action.UseCases
	actions    action.Action
	plugins    plugin.UseCases
}

func (s *ActionSuite) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *ActionSuite) BeforeTest(_, _ string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	s.repository = action.NewMain(s.DB, s.plugins)
	clearDatabase(s.DB)
}

func (s *ActionSuite) AfterTest(_, _ string) {
	s.DB.Close()
}

func TestInitActions(t *testing.T) {
	suite.Run(t, new(ActionSuite))
}

func (s *ActionSuite) TestParseAction() {
	stringReader := strings.NewReader(`{
    "nickname": "Open-sea up",
    "type": "  CircleUpstream  ",
    "description": "    ",
    "configuration": {
        "authorId": "123456789",
        "destinyCircle": "open-sea"
    },
    "workspaceId": "5b17f1ec-41ab-472a-b307-f0495e480a1c"
}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.ParseAction(stringReadCloser)

	wsID, _ := uuid.Parse("5b17f1ec-41ab-472a-b307-f0495e480a1c")

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)

	require.Equal(s.T(), "Open-sea up", res.Nickname)
	require.Equal(s.T(), "CircleUpstream", res.Type)
	require.Equal(s.T(), "", res.Description)
	require.Equal(s.T(), wsID, res.WorkspaceId)
	require.NotNil(s.T(), res.Configuration)
	require.True(s.T(), len(res.Configuration) > 0)
}

func (s *ActionSuite) TestParseActionError() {
	stringReader := strings.NewReader(``)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.ParseAction(stringReadCloser)

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestFindActionById() {
	actionToFind := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New(),
		DeletedAt:     nil,
	}

	s.DB.Create(&actionToFind)
	res, err := s.repository.FindActionById(actionToFind.ID.String())

	require.NoError(s.T(), err)
	actionToFind.BaseModel = res.BaseModel
	require.Equal(s.T(), actionToFind, res)
}

func (s *ActionSuite) TestFindActionByIdError() {
	s.DB.Close()
	_, err := s.repository.FindActionById(uuid.New().String())
	require.Error(s.T(), err)
}

func (s *ActionSuite) TestFindActionByIdAndWorkspace() {
	workspaceID := uuid.New()
	actionToFind := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   workspaceID,
		DeletedAt:     nil,
	}

	s.DB.Create(&actionToFind)
	res, err := s.repository.FindActionByIdAndWorkspace(actionToFind.ID.String(), workspaceID.String())

	require.NoError(s.T(), err)
	actionToFind.BaseModel = res.BaseModel
	require.Equal(s.T(), actionToFind, res)
	require.Equal(s.T(), workspaceID, res.WorkspaceId)
}

func (s *ActionSuite) TestFindActionByIdAndWorkspaceError() {
	s.DB.Close()
	_, err := s.repository.FindActionByIdAndWorkspace(uuid.New().String(), uuid.New().String())
	require.Error(s.T(), err)
}

func (s *ActionSuite) TestFindAllActionByWorkspace() {
	wspID := uuid.New()
	actionStruct1 := action.Action{
		Nickname:      "ActionName1",
		Type:          "CircleUp",
		Description:   "Desc",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   wspID,
		DeletedAt:     nil,
	}

	actionStruct2 := action.Action{
		Nickname:      "ActionName2",
		Type:          "CircleDown",
		Description:   "Desc",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   wspID,
		DeletedAt:     nil,
	}

	s.DB.Create(&actionStruct1)
	s.DB.Create(&actionStruct2)

	res, err := s.repository.FindAllActionsByWorkspace(wspID.String())

	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
	require.Len(s.T(), res, 2)
}

func (s *ActionSuite) TestFindByAllActionError() {
	s.DB.Close()
	_, err := s.repository.FindAllActionsByWorkspace(uuid.New().String())

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestSaveAction() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Description:   "Desc",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New(),
		DeletedAt:     nil,
	}

	res, err := s.repository.SaveAction(actionStruct)
	require.NoError(s.T(), err)

	actionStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), actionStruct, res)
}

func (s *ActionSuite) TestSaveActionError() {
	s.DB.Close()
	actionStruct := action.Action{}
	_, err := s.repository.SaveAction(actionStruct)

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestDeleteAction() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Description:   "Desc",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New(),
		DeletedAt:     nil,
	}

	s.DB.Create(&actionStruct)
	err := s.repository.DeleteAction(actionStruct.ID.String())
	require.NoError(s.T(), err)
}

func (s *ActionSuite) TestDeleteActionError() {
	s.DB.Close()
	err := s.repository.DeleteAction(uuid.New().String())
	require.Error(s.T(), err)
}
