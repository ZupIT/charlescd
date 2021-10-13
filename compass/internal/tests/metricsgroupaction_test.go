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
	"time"

	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type MetricsGroupActionSuite struct {
	suite.Suite
	DB *gorm.DB

	repository metricsgroupaction.UseCases
	pluginRepo plugin.UseCases
	actionRepo action.UseCases
	mga        metricsgroupaction.MetricsGroupAction
}

func (s *MetricsGroupActionSuite) SetupSuite() {
	setupEnv()
}

func (s *MetricsGroupActionSuite) BeforeTest(_, _ string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.Nil(s.T(), err)

	s.DB.LogMode(dbLog)

	s.pluginRepo = plugin.NewMain()
	s.actionRepo = action.NewMain(s.DB, s.pluginRepo)

	s.repository = metricsgroupaction.NewMain(s.DB, s.pluginRepo, s.actionRepo)
	clearDatabase(s.DB)
}

func (s *MetricsGroupActionSuite) AfterTest(_, _ string) {
	s.DB.Close()
}

func TestInitMetricsGroupActions(t *testing.T) {
	suite.Run(t, new(MetricsGroupActionSuite))
}

func (s *MetricsGroupActionSuite) TestParseGroupAction() {
	stringReader := strings.NewReader(`{
    "nickname": " ExecutionName ",
    "metricsGroupId": "8800ba87-94e9-443e-9e10-59efe8c58706",
    "actionId": "f1fbe330-c7f6-4215-8311-83015b8df761",
    "executionParameters": {
        "destinationCircleId": "e5b84a9a-340a-49ed-a035-0666506de2d6"
    },
	"configuration": {
		"repeatable": true,
		"numberOfCycles": 0
	}
}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.ParseGroupAction(stringReadCloser)

	groupID, _ := uuid.Parse("8800ba87-94e9-443e-9e10-59efe8c58706")
	actID, _ := uuid.Parse("f1fbe330-c7f6-4215-8311-83015b8df761")

	require.Nil(s.T(), err)
	require.NotNil(s.T(), res)

	require.Equal(s.T(), "ExecutionName", res.Nickname)
	require.Equal(s.T(), groupID, res.MetricsGroupID)
	require.Equal(s.T(), actID, res.ActionID)
	require.NotNil(s.T(), res.ExecutionParameters)
	require.True(s.T(), res.ActionsConfiguration.Repeatable)
	require.Equal(s.T(), int16(0), res.ActionsConfiguration.NumberOfCycles)
}

func (s *MetricsGroupActionSuite) TestParseGroupActionError() {
	stringReader := strings.NewReader(``)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.ParseGroupAction(stringReadCloser)

	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestSaveMetricsGroupAction() {
	act := newBasicAction()
	group := newBasicMetricGroup()

	s.DB.Create(&group)
	s.DB.Create(&act)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID

	res, err := s.repository.SaveGroupAction(groupAction)

	require.Nil(s.T(), err)
	groupAction.BaseModel = res.BaseModel
	require.Equal(s.T(), groupAction, res)
}

func (s *MetricsGroupActionSuite) TestSaveMetricsGroupActionError() {
	s.DB.Close()
	_, err := s.repository.SaveGroupAction(newBasicGroupAction())

	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestFindByIdMetricsGroupAction() {
	act := newBasicAction()
	group := newBasicMetricGroup()

	s.DB.Create(&group)
	s.DB.Create(&act)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID

	s.DB.Create(&groupAction)

	res, err := s.repository.FindGroupActionByID(groupAction.ID.String())
	require.Nil(s.T(), err)
	require.Equal(s.T(), groupAction.ID, res.ID)
}

func (s *MetricsGroupActionSuite) TestFindByIdMetricsGroupActionError() {
	s.DB.Close()
	_, err := s.repository.FindGroupActionByID(uuid.New().String())
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestDeleteMetricsGroupAction() {
	act := newBasicAction()
	group := newBasicMetricGroup()

	s.DB.Create(&group)
	s.DB.Create(&act)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID

	s.DB.Create(&groupAction)

	err := s.repository.DeleteGroupAction(groupAction.ID.String())
	require.Nil(s.T(), err)

	var verify metricsgroupaction.MetricsGroupAction
	s.DB.Where("id = ?", groupAction.ID).Find(&verify)

	require.Equal(s.T(), metricsgroupaction.MetricsGroupAction{}, verify)
}

func (s *MetricsGroupActionSuite) TestDeleteMetricsGroupActionError() {
	s.DB.Close()
	err := s.repository.DeleteGroupAction(uuid.New().String())
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestFindAllMetricsGroupActionResume() {
	act := newBasicAction()
	s.DB.Create(&act)

	group1 := newBasicMetricGroup()
	s.DB.Create(&group1)

	group2 := newBasicMetricGroup()
	s.DB.Create(&group2)

	groupAction1 := newBasicGroupAction()
	groupAction1.ActionID = act.ID
	groupAction1.MetricsGroupID = group1.ID
	groupAction2 := newBasicGroupAction()
	groupAction2.ActionID = act.ID
	groupAction2.MetricsGroupID = group1.ID
	groupAction3 := newBasicGroupAction()
	groupAction3.ActionID = act.ID
	groupAction3.MetricsGroupID = group2.ID
	groupAction4 := newBasicGroupAction()
	groupAction4.ActionID = act.ID
	groupAction4.MetricsGroupID = group1.ID
	now := time.Now()
	groupAction4.DeletedAt = &now
	groupAction5 := newBasicGroupAction()
	groupAction5.ActionID = act.ID
	groupAction5.MetricsGroupID = group1.ID
	s.DB.Create(&groupAction1)
	s.DB.Create(&groupAction2)
	s.DB.Create(&groupAction3)
	s.DB.Create(&groupAction4)
	s.DB.Create(&groupAction5)

	ga1Execution := newBasicActionExecution()
	ga1Execution.GroupActionID = groupAction1.ID
	ge1Start := time.Now()
	ga1Execution.StartedAt = &ge1Start
	ga5Execution := newBasicActionExecution()
	ga5Execution.GroupActionID = groupAction5.ID
	ge5Start := time.Now().Add(5000)
	ga5Execution.StartedAt = &ge5Start

	s.DB.Create(&ga1Execution)
	s.DB.Create(&ga5Execution)

	res, err := s.repository.ListGroupActionExecutionResumeByGroup(group1.ID.String())

	require.Nil(s.T(), err)
	require.NotEmpty(s.T(), res)
	require.Len(s.T(), res, 3)
	require.Equal(s.T(), groupAction5.ID.String(), res[0].ID)
	require.Equal(s.T(), groupAction5.Nickname, res[0].Nickname)
	require.Equal(s.T(), act.Nickname, res[0].ActionType)
	require.Equal(s.T(), "IN_EXECUTION", res[0].Status)
	require.NotNil(s.T(), res[0].StartedAt)
	require.Equal(s.T(), groupAction1.ID.String(), res[1].ID)
	require.Equal(s.T(), groupAction1.Nickname, res[1].Nickname)
	require.Equal(s.T(), act.Nickname, res[1].ActionType)
	require.Equal(s.T(), "IN_EXECUTION", res[1].Status)
	require.NotNil(s.T(), res[1].StartedAt)
	require.Equal(s.T(), groupAction2.ID.String(), res[2].ID)
	require.Equal(s.T(), groupAction2.Nickname, res[2].Nickname)
	require.Equal(s.T(), act.Nickname, res[2].ActionType)
	require.Equal(s.T(), "NOT_EXECUTED", res[2].Status)
	require.Nil(s.T(), res[2].StartedAt)

}

func (s *MetricsGroupActionSuite) TestFindAllMetricsGroupActionResumeError() {
	s.DB.Close()
	_, err := s.repository.ListGroupActionExecutionResumeByGroup(uuid.New().String())
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestUpdateMetricsGroupAction() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	s.DB.Create(&groupAction)

	groupAction.ExecutionParameters = json.RawMessage(`{"update": "eoq"}`)

	res, err := s.repository.UpdateGroupAction(groupAction.ID.String(), groupAction)
	require.Nil(s.T(), err)
	require.Equal(s.T(), groupAction.ExecutionParameters, res.ExecutionParameters)
}

func (s *MetricsGroupActionSuite) TestUpdateMetricsGroupActionIdParseError() {
	_, err := s.repository.UpdateGroupAction("12345", metricsgroupaction.MetricsGroupAction{})
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestUpdateMetricsGroupActionIdError() {
	s.DB.Close()
	_, err := s.repository.UpdateGroupAction(uuid.New().String(), metricsgroupaction.MetricsGroupAction{})
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestCreateNewExecution() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	s.DB.Create(&groupAction)

	res, err := s.repository.CreateNewExecution(groupAction.ID.String())
	require.Nil(s.T(), err)

	var executions []metricsgroupaction.ActionsExecutions
	s.DB.Where("group_action_id = ?", groupAction.ID).Find(&executions)

	require.Len(s.T(), executions, 1)
	require.Equal(s.T(), res.ID, executions[0].ID)
	require.Equal(s.T(), "IN_EXECUTION", res.Status)
}

func (s *MetricsGroupActionSuite) TestCreateNewExecutionWrongIDFormat() {
	_, err := s.repository.CreateNewExecution("i'm a wrong format")
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestCreateNewExecutionError() {
	s.DB.Close()
	_, err := s.repository.CreateNewExecution(uuid.New().String())
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestSetExecutionFailed() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	s.DB.Create(&groupAction)

	execution := newBasicActionExecution()
	execution.GroupActionID = groupAction.ID
	s.DB.Create(&execution)

	res, err := s.repository.SetExecutionFailed(execution.ID.String(), "Just Exploded")
	require.Nil(s.T(), err)

	var executions []metricsgroupaction.ActionsExecutions
	s.DB.Where("group_action_id = ?", groupAction.ID).Find(&executions)

	require.Len(s.T(), executions, 1)
	require.Equal(s.T(), res.ID, executions[0].ID)
	require.Equal(s.T(), "FAILED", res.Status)
}

func (s *MetricsGroupActionSuite) TestSetExecutionFailedNotFoundExecution() {
	_, err := s.repository.SetExecutionFailed("i does not exist", "Just Exploded")
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestSetExecutionFailedNotInExecution() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	s.DB.Create(&groupAction)

	execution := newBasicActionExecution()
	execution.GroupActionID = groupAction.ID
	execution.Status = "SUCCESS"
	s.DB.Create(&execution)

	_, err := s.repository.SetExecutionFailed(execution.ID.String(), "Just Exploded")
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestSetExecutionFailedError() {
	s.DB.Close()
	_, err := s.repository.SetExecutionFailed(uuid.New().String(), "Ops!")
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestSetExecutionSuccess() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	s.DB.Create(&groupAction)

	execution := newBasicActionExecution()
	execution.GroupActionID = groupAction.ID
	s.DB.Create(&execution)

	res, err := s.repository.SetExecutionSuccess(execution.ID.String(), "Im fine")
	require.Nil(s.T(), err)

	var executions []metricsgroupaction.ActionsExecutions
	s.DB.Where("group_action_id = ?", groupAction.ID).Find(&executions)

	require.Len(s.T(), executions, 1)
	require.Equal(s.T(), res.ID, executions[0].ID)
	require.Equal(s.T(), "SUCCESS", res.Status)
}

func (s *MetricsGroupActionSuite) TestSetExecutionSuccessNotFoundExecution() {
	_, err := s.repository.SetExecutionSuccess("i does not exist", "Im fine")
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestSetExecutionSuccessNotInExecution() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	s.DB.Create(&groupAction)

	execution := newBasicActionExecution()
	execution.GroupActionID = groupAction.ID
	execution.Status = "FAILED"
	s.DB.Create(&execution)

	_, err := s.repository.SetExecutionSuccess(execution.ID.String(), "Im Fine")
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestSetExecutionSuccessError() {
	s.DB.Close()
	_, err := s.repository.SetExecutionSuccess(uuid.New().String(), "Ops!")
	require.NotNil(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestValidateRepeatableActionWithNoExecutionsCanBeExecuted() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	groupAction.ActionsConfiguration.Repeatable = true
	groupAction.ActionsConfiguration.NumberOfCycles = 0
	s.DB.Create(&groupAction)

	res := s.repository.ValidateActionCanBeExecuted(groupAction)
	require.True(s.T(), res)
}

func (s *MetricsGroupActionSuite) TestValidateRepeatableActionWithExecutionsCanBeExecuted() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	groupAction.ActionsConfiguration.Repeatable = true
	groupAction.ActionsConfiguration.NumberOfCycles = 0
	s.DB.Create(&groupAction)

	execution := newBasicActionExecution()
	execution.GroupActionID = groupAction.ID
	execution.Status = "SUCCESS"
	s.DB.Create(&execution)

	res := s.repository.ValidateActionCanBeExecuted(groupAction)
	require.True(s.T(), res)
}

func (s *MetricsGroupActionSuite) TestValidateNotRepeatableActionWithNoExecutionsCanBeExecuted() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	groupAction.ActionsConfiguration.Repeatable = false
	groupAction.ActionsConfiguration.NumberOfCycles = 1
	s.DB.Create(&groupAction)

	res := s.repository.ValidateActionCanBeExecuted(groupAction)
	require.True(s.T(), res)
}

func (s *MetricsGroupActionSuite) TestValidateNotRepeatableActionWithExecutionsCanBeExecuted() {
	act := newBasicAction()
	s.DB.Create(&act)

	group := newBasicMetricGroup()
	s.DB.Create(&group)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = act.ID
	groupAction.MetricsGroupID = group.ID
	groupAction.ActionsConfiguration.Repeatable = false
	groupAction.ActionsConfiguration.NumberOfCycles = 1
	s.DB.Create(&groupAction)

	execution := newBasicActionExecution()
	execution.GroupActionID = groupAction.ID
	execution.Status = "SUCCESS"
	s.DB.Create(&execution)

	res := s.repository.ValidateActionCanBeExecuted(groupAction)
	require.False(s.T(), res)
}

func (s *MetricsGroupActionSuite) TestValidateActionCanBeExecutedError() {
	s.DB.Close()
	res := s.repository.ValidateActionCanBeExecuted(newBasicGroupAction())
	require.False(s.T(), res)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionEmptyNickname() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.Nickname = ""
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "nickname", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action nickname is required", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionBlankNickname() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.Nickname = "   "
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "nickname", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action nickname is required", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionNicknameTooLong() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.Nickname = bigString
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "nickname", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "nickname is limited to 100 characters maximum", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionNilMetricGroupID() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "metricGroup", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "metric group id is required", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionNilExecutionParameters() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = actionToFind.ID
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ExecutionParameters = nil
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "executionParameters", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "execution parameters is required", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionEmptyExecutionParameters() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.ActionID = actionToFind.ID
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ExecutionParameters = json.RawMessage("")
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "executionParameters", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "execution parameters is required", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionNilActionID() {
	groupAction := newBasicGroupAction()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, uuid.New())
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "action", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action id is required", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionActionNotFound() {
	groupAction := newBasicGroupAction()
	groupAction.ActionID = uuid.New()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, uuid.New())
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "action", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action is invalid", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionActionSearchError() {
	s.DB.Close()
	groupAction := newBasicGroupAction()
	groupAction.ActionID = uuid.New()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, uuid.New())
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "action", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action is invalid", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionNegativeCycles() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.NumberOfCycles = -5

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "configuration.NumberOfCycles", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "the number of cycle needs an positive integer", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionNotRepeatableZeroCycles() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.NumberOfCycles = 0
	groupAction.ActionsConfiguration.Repeatable = false

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "configuration.Repeatable", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "a not repeatable action needs a defined number of cycles", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionPluginNotFound() {
	workspaceID := uuid.New()
	act := newBasicAction()
	act.WorkspaceID = workspaceID
	act.Type = "no_plugin_found"
	s.DB.Create(&act)

	groupAction := newBasicGroupAction()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = act.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, workspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "action", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action is invalid", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionLookupError() {
	workspaceID := uuid.New()
	act := newBasicAction()
	act.WorkspaceID = workspaceID
	act.Type = "nofuncaction"
	s.DB.Create(&act)

	groupAction := newBasicGroupAction()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = act.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, workspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "action", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "action is invalid", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionInvalid() {
	insertAction, actionToFind := actionInsert("invalidaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 1)
	require.Equal(s.T(), "executionParameters", res.GetErrors()[0].Error().Meta["field"])
	require.Equal(s.T(), "invalid config", res.GetErrors()[0].Error().Detail)
}

func (s *MetricsGroupActionSuite) TestValidateGroupActionOk() {
	insertAction, actionToFind := actionInsert("validaction")
	s.DB.Exec(insertAction)

	groupAction := newBasicGroupAction()
	groupAction.MetricsGroupID = uuid.New()
	groupAction.ActionID = actionToFind.ID
	groupAction.ActionsConfiguration.Repeatable = true

	res := s.repository.ValidateGroupAction(groupAction, actionToFind.WorkspaceID)
	require.Len(s.T(), res.GetErrors(), 0)
}
