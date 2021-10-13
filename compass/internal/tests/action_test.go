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
	"io/ioutil"
	"strings"
	"testing"

	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
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
	require.Nil(s.T(), err)

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

	require.Nil(s.T(), err)
	require.NotNil(s.T(), res)

	require.Equal(s.T(), "Open-sea up", res.Nickname)
	require.Equal(s.T(), "CircleUpstream", res.Type)
	require.Equal(s.T(), "", res.Description)
	require.Equal(s.T(), wsID, res.WorkspaceID)
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

	require.Nil(s.T(), err)
	require.NotNil(s.T(), res)

	require.Equal(s.T(), "Open-sea up", res.Nickname)
	require.Equal(s.T(), "CircleUpstream", res.Type)
	require.Equal(s.T(), "", res.Description)
	require.Equal(s.T(), wsID, res.WorkspaceID)
	require.NotNil(s.T(), res.Configuration)
	require.True(s.T(), len(res.Configuration) > 0)
}

func (s *ActionSuite) TestParseActionError() {
	stringReader := strings.NewReader(``)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.ParseAction(stringReadCloser)

	require.NotNil(s.T(), err)
}

func (s *ActionSuite) TestFindActionById() {
	insertAction, actionToFind := actionInsert("validaction")

	s.DB.Exec(insertAction)
	res, err := s.repository.FindActionByID(actionToFind.ID.String())

	require.Nil(s.T(), err)
	actionToFind.BaseModel = res.BaseModel
	require.Equal(s.T(), actionToFind, res)
}

func (s *ActionSuite) TestFindActionByIdError() {
	s.DB.Close()
	_, err := s.repository.FindActionByID(uuid.New().String())
	require.NotNil(s.T(), err)
}

func (s *ActionSuite) TestFindActionByIdAndWorkspace() {
	insertAction, actionToFind := actionInsert("validaction")

	s.DB.Exec(insertAction)
	res, err := s.repository.FindActionByIDAndWorkspace(actionToFind.ID, actionToFind.WorkspaceID)

	require.Nil(s.T(), err)
	actionToFind.BaseModel = res.BaseModel
	require.Equal(s.T(), actionToFind, res)
}

func (s *ActionSuite) TestFindActionByIdAndWorkspaceError() {
	s.DB.Close()
	_, err := s.repository.FindActionByIDAndWorkspace(uuid.New(), uuid.New())
	require.NotNil(s.T(), err)
}

func (s *ActionSuite) TestFindAllActionByWorkspace() {
	wspID := uuid.New()
	actionStruct1 := newBasicAction()
	actionStruct1.WorkspaceID = wspID

	actionStruct2 := newBasicAction()
	actionStruct2.WorkspaceID = wspID

	s.DB.Create(&actionStruct1)
	s.DB.Create(&actionStruct2)

	res, err := s.repository.FindAllActionsByWorkspace(wspID)

	require.Nil(s.T(), err)
	require.NotEmpty(s.T(), res)
	require.Len(s.T(), res, 2)
}

func (s *ActionSuite) TestFindByAllActionError() {
	s.DB.Close()
	_, err := s.repository.FindAllActionsByWorkspace(uuid.New())

	require.NotNil(s.T(), err)
}

func (s *ActionSuite) TestSaveAction() {
	actionStruct := newBasicActionRequest()

	res, err := s.repository.SaveAction(actionStruct)
	require.Nil(s.T(), err)

	actionStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), actionStruct.BaseModel, res.BaseModel)
	require.Equal(s.T(), actionStruct.Nickname, res.Nickname)
	require.Equal(s.T(), actionStruct.Type, res.Type)
}

func (s *ActionSuite) TestSaveActionError() {
	s.DB.Close()
	actionStruct := action.Request{}
	_, err := s.repository.SaveAction(actionStruct)

	require.NotNil(s.T(), err)
}

func (s *ActionSuite) TestDeleteAction() {
	actionStruct := newBasicAction()

	s.DB.Create(&actionStruct)
	err := s.repository.DeleteAction(actionStruct.ID.String())
	require.Nil(s.T(), err)
}

func (s *ActionSuite) TestDeleteActionError() {
	s.DB.Close()
	err := s.repository.DeleteAction(uuid.New().String())
	require.NotNil(s.T(), err)
}

func (s *ActionSuite) TestValidateActionEmptyNickname() {
	act := newBasicActionRequest()
	act.Nickname = ""

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "nickname", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action nickname is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionBlankNickname() {
	act := newBasicActionRequest()
	act.Nickname = "  "

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "nickname", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action nickname is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionTooLongNickname() {
	act := newBasicActionRequest()
	act.Nickname = bigString

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "nickname", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action nickname is limited to 64 characters maximum", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionEmptyDescription() {
	act := newBasicActionRequest()
	act.Description = ""

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "description", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "description is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionBlankDescription() {
	act := newBasicActionRequest()
	act.Description = "  "

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "description", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "description is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionTooLongDescription() {
	act := newBasicActionRequest()
	act.Description = bigString

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "description", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "description is limited to 64 characters maximum", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionNilConfiguration() {
	act := newBasicActionRequest()
	act.Configuration = nil

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "configuration", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action configuration is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionEmptyConfiguration() {
	act := newBasicActionRequest()
	act.Configuration = json.RawMessage("")

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "configuration", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action configuration is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionNilWorkspace() {
	act := newBasicActionRequest()
	act.WorkspaceID = uuid.Nil

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "workspaceId", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "workspaceId is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionEmptyType() {
	act := newBasicActionRequest()
	act.Type = ""

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "type", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action type is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionBlankType() {
	act := newBasicActionRequest()
	act.Type = "  "

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "type", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action type is required", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionTypeToo() {
	act := newBasicActionRequest()
	act.Type = bigString

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "type", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action type is limited to 100 characters maximum", res.GetErrors()[0].Error().Detail)
}

func (s *ActionSuite) TestValidateActionPluginNotFound() {
	act := newBasicActionRequest()
	act.Type = "no_plugin_found"

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "type", res.GetErrors()[0].ErrorWithOperations().Meta["field"])
	require.NotEmpty(s.T(), res.GetErrors()[0].ErrorWithOperations().Detail)
	require.Equal(s.T(), "Invalid data", res.GetErrors()[0].ErrorWithOperations().Title)
	require.Len(s.T(), res.GetErrors()[0].ErrorWithOperations().Operations, 1)
	require.Equal(s.T(), "validateActionConfig.GetPluginBySrc", res.GetErrors()[0].ErrorWithOperations().Operations[0])
}

func (s *ActionSuite) TestValidateActionPluginLookupError() {
	act := newBasicActionRequest()
	act.Type = "nofuncaction"

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "type", res.GetErrors()[0].ErrorWithOperations().Meta["field"])
	require.NotEmpty(s.T(), res.GetErrors()[0].ErrorWithOperations().Detail)
	require.Equal(s.T(), "Invalid data", res.GetErrors()[0].ErrorWithOperations().Title)
	require.Len(s.T(), res.GetErrors()[0].ErrorWithOperations().Operations, 1)
	require.Equal(s.T(), "validateActionConfig.Lookup", res.GetErrors()[0].ErrorWithOperations().Operations[0])
}

func (s *ActionSuite) TestValidateActionInvalidConfig() {
	act := newBasicActionRequest()
	act.Type = "invalidaction"

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "type", res.GetErrors()[0].ErrorWithOperations().Meta["field"])
	require.NotEmpty(s.T(), res.GetErrors()[0].ErrorWithOperations().Detail)
	require.Equal(s.T(), "Invalid data", res.GetErrors()[0].ErrorWithOperations().Title)
	require.Len(s.T(), res.GetErrors()[0].ErrorWithOperations().Operations, 1)
	require.Equal(s.T(), "validateActionConfig.pluginErrs", res.GetErrors()[0].ErrorWithOperations().Operations[0])
}

func (s *ActionSuite) TestValidateActionOk() {
	act := newBasicActionRequest()

	res := s.repository.ValidateAction(act)

	require.Len(s.T(), res.GetErrors(), 0)
}
