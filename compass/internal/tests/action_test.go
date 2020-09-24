package tests

import (
	"compass/internal/action"
	"compass/internal/configuration"
	"compass/internal/util"
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
}

func (s *ActionSuite) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *ActionSuite) BeforeTest(suiteName, testName string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	s.repository = action.NewMain(s.DB)
	s.DB.Exec("DELETE FROM actions")
}

func (s *ActionSuite) AfterTest(suiteName, testName string) {
	s.DB.Close()
}

func TestInitActions(t *testing.T) {
	suite.Run(t, new(ActionSuite))
}

func (s *ActionSuite) TestParseAction() {
	stringReader := strings.NewReader(`{
    "nickname": "Open-sea up",
    "type": "CircleUpstream",
    "configuration": {
        "authorId": "123456789",
        "destinyCircle": "open-sea"
    },
    "workspaceId": "5b17f1ec-41ab-472a-b307-f0495e480a1c"
}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.ParseAction(stringReadCloser)

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *ActionSuite) TestParseActionError() {
	stringReader := strings.NewReader(``)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.ParseAction(stringReadCloser)

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestValidateAction() {
	action := action.Action{
		BaseModel: util.BaseModel{},
		DeletedAt: nil,
	}
	res := s.repository.ValidateAction(action)

	require.NotEmpty(s.T(), res)
}

func (s *ActionSuite) TestFindByIdAction() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}

	s.DB.Create(&actionStruct)
	res, err := s.repository.FindActionById(actionStruct.ID.String())

	require.NoError(s.T(), err)
	actionStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), actionStruct, res)
}

func (s *ActionSuite) TestFindByIdActionError() {
	_, err := s.repository.FindActionById(uuid.New().String())
	require.Error(s.T(), err)
}

func (s *ActionSuite) TestFindByAllAction() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}

	s.DB.Create(&actionStruct)
	res, err := s.repository.FindAllActions()

	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
}

func (s *ActionSuite) TestFindByAllActionError() {
	s.DB.Close()
	_, err := s.repository.FindAllActions()

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestSaveAction() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}

	res, err := s.repository.SaveAction(actionStruct)

	require.NoError(s.T(), err)
	actionStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), actionStruct, res)
}

func (s *ActionSuite) TestSaveActionError() {
	actionStruct := action.Action{}
	_, err := s.repository.SaveAction(actionStruct)

	require.Error(s.T(), err)
}

func (s *ActionSuite) TestDeleteAction() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
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

func (s *ActionSuite) TestUpdateAction() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}

	s.DB.Create(&actionStruct)

	actionStruct.Type = "CircleDown"
	res, err := s.repository.UpdateAction(actionStruct.ID.String(), actionStruct)

	require.NoError(s.T(), err)
	require.Equal(s.T(), actionStruct.Type, res.Type)
}

func (s *ActionSuite) TestUpdateActionError() {
	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}

	s.DB.Create(&actionStruct)
	actionStruct.Nickname = ""
	s.DB.Close()
	_, err := s.repository.UpdateAction(actionStruct.ID.String(), actionStruct)

	require.Error(s.T(), err)
}
