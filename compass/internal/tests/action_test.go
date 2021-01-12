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
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"io/ioutil"
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
	setupEnv()
}

func (s *ActionSuite) BeforeTest(_, _ string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	s.plugins = plugin.NewMain()
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
	"useDefaultConfiguration": false,
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

func (s *ActionSuite) TestParseActionUseDefault() {
	stringReader := strings.NewReader(`{
    "nickname": "Open-sea up",
    "type": "  CircleUpstream  ",
    "description": "    ",
	"useDefaultConfiguration": true,
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
	insertAction, actionToFind := actionInsert("validaction")

	s.DB.Exec(insertAction)
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
	insertAction, actionToFind := actionInsert("validaction")

	s.DB.Exec(insertAction)
	res, err := s.repository.FindActionByIdAndWorkspace(actionToFind.ID, actionToFind.WorkspaceId)

	require.NoError(s.T(), err)
	actionToFind.BaseModel = res.BaseModel
	require.Equal(s.T(), actionToFind, res)
}

func (s *ActionSuite) TestFindActionByIdAndWorkspaceError() {
	s.DB.Close()
	_, err := s.repository.FindActionByIdAndWorkspace(uuid.New(), uuid.New())
	require.Error(s.T(), err)
}

func (s *ActionSuite) TestFindAllActionByWorkspace() {
	wspID := uuid.New()
	actionStruct1 := newBasicAction()
	actionStruct1.WorkspaceId = wspID

	actionStruct2 := newBasicAction()
	actionStruct2.WorkspaceId = wspID

	s.DB.Create(&actionStruct1)
	s.DB.Create(&actionStruct2)

	res, err := s.repository.FindAllActionsByWorkspace(wspID)

	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
	require.Len(s.T(), res, 2)
}

func (s *ActionSuite) TestFindByAllActionError() {
	s.DB.Close()
	_, err := s.repository.FindAllActionsByWorkspace(uuid.New())

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestSaveAction() {
	actionStruct := newBasicActionRequest()

	res, err := s.repository.SaveAction(actionStruct)
	require.NoError(s.T(), err)

	actionStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), actionStruct.BaseModel, res.BaseModel)
	require.Equal(s.T(), actionStruct.Nickname, res.Nickname)
	require.Equal(s.T(), actionStruct.Type, res.Type)
}

func (s *ActionSuite) TestSaveActionError() {
	s.DB.Close()
	actionStruct := action.Request{}
	_, err := s.repository.SaveAction(actionStruct)

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestDeleteAction() {
	actionStruct := newBasicAction()

	s.DB.Create(&actionStruct)
	err := s.repository.DeleteAction(actionStruct.ID.String())
	require.NoError(s.T(), err)
}

func (s *ActionSuite) TestDeleteActionError() {
	s.DB.Close()
	err := s.repository.DeleteAction(uuid.New().String())
	require.Error(s.T(), err)
}

func (s *ActionSuite) TestValidateActionEmptyNickname() {
	act := newBasicActionRequest()
	act.Nickname = ""

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "nickname", res[0].Field)
	require.Equal(s.T(), "action nickname is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionBlankNickname() {
	act := newBasicActionRequest()
	act.Nickname = "  "

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "nickname", res[0].Field)
	require.Equal(s.T(), "action nickname is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionTooLongNickname() {
	act := newBasicActionRequest()
	act.Nickname = bigString

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "nickname", res[0].Field)
	require.Equal(s.T(), "action nickname is limited to 100 characters maximum", res[0].Error)
}

func (s *ActionSuite) TestValidateActionEmptyDescription() {
	act := newBasicActionRequest()
	act.Description = ""

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "description", res[0].Field)
	require.Equal(s.T(), "description is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionBlankDescription() {
	act := newBasicActionRequest()
	act.Description = "  "

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "description", res[0].Field)
	require.Equal(s.T(), "description is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionTooLongDescription() {
	act := newBasicActionRequest()
	act.Description = bigString

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "description", res[0].Field)
	require.Equal(s.T(), "description is limited to 100 characters maximum", res[0].Error)
}

func (s *ActionSuite) TestValidateActionNilConfiguration() {
	act := newBasicActionRequest()
	act.Configuration = nil

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "configuration", res[0].Field)
	require.Equal(s.T(), "action configuration is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionEmptyConfiguration() {
	act := newBasicActionRequest()
	act.Configuration = json.RawMessage("")

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "configuration", res[0].Field)
	require.Equal(s.T(), "action configuration is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionNilWorkspace() {
	act := newBasicActionRequest()
	act.WorkspaceId = uuid.Nil

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "workspaceId", res[0].Field)
	require.Equal(s.T(), "workspaceId is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionEmptyType() {
	act := newBasicActionRequest()
	act.Type = ""

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "type", res[0].Field)
	require.Equal(s.T(), "action type is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionBlankType() {
	act := newBasicActionRequest()
	act.Type = "  "

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "type", res[0].Field)
	require.Equal(s.T(), "action type is required", res[0].Error)
}

func (s *ActionSuite) TestValidateActionTypeToo() {
	act := newBasicActionRequest()
	act.Type = bigString

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "type", res[0].Field)
	require.Equal(s.T(), "action type is limited to 100 characters maximum", res[0].Error)
}

func (s *ActionSuite) TestValidateActionPluginNotFound() {
	act := newBasicActionRequest()
	act.Type = "no_plugin_found"

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "type", res[0].Field)
	require.Equal(s.T(), "action type is invalid", res[0].Error)
}

func (s *ActionSuite) TestValidateActionPluginLookupError() {
	act := newBasicActionRequest()
	act.Type = "nofuncaction"

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "type", res[0].Field)
	require.Equal(s.T(), "action type is invalid", res[0].Error)
}

func (s *ActionSuite) TestValidateActionInvalidConfig() {
	act := newBasicActionRequest()
	act.Type = "invalidaction"

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 1)
	require.Equal(s.T(), "configuration", res[0].Field)
	require.Equal(s.T(), "invalid config", res[0].Error)
}

func (s *ActionSuite) TestValidateActionOk() {
	act := newBasicActionRequest()

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res, 0)
}
