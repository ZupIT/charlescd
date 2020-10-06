package tests

import (
	"compass/internal/action"
	"compass/internal/configuration"
	metric2 "compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/metricsgroupaction"
	"compass/internal/plugin"
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

type MetricsGroupActionSuite struct {
	suite.Suite
	DB *gorm.DB

	repository metricsgroupaction.UseCases
	pluginRepo plugin.UseCases
	actionRepo action.UseCases
	mga        metricsgroupaction.MetricsGroupActions
}

func (s *MetricsGroupActionSuite) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *MetricsGroupActionSuite) BeforeTest(suiteName, testName string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	s.repository = metricsgroupaction.NewMain(s.DB, s.pluginRepo, s.actionRepo)
	s.DB.Exec("DELETE FROM metrics_group_actions")
	s.DB.Exec("DELETE FROM actions")
	s.DB.Exec("DELETE FROM metrics_groups")
}

func (s *MetricsGroupActionSuite) AfterTest(suiteName, testName string) {
	s.DB.Close()
}

func TestInitMetricsGroupActions(t *testing.T) {
	suite.Run(t, new(MetricsGroupActionSuite))
}

func (s *ActionSuite) TestParseGroupAction() {
	stringReader := strings.NewReader(`{
    "nickname": " ExecutionName ",
    "metricsGroupId": "8800ba87-94e9-443e-9e10-59efe8c58706",
    "actionsId": "f1fbe330-c7f6-4215-8311-83015b8df761",
    "executionParameters": {
        "circleId": "123456789"
    },
	"configuration": {
		"repeatable": true,
		"numberOfCycles": 0
	}"
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

func (s *ActionSuite) TestParseGroupActionError() {
	stringReader := strings.NewReader(``)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.ParseAction(stringReadCloser)

	require.Error(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestValidateMetricsGroupAction() {
	mgaStruct := metricsgroupaction.MetricsGroupActions{
		BaseModel:           util.BaseModel{},
		Nickname:            "",
		MetricsGroupID:      uuid.UUID{},
		ActionsID:           uuid.UUID{},
		ExecutionParameters: nil,
		DeletedAt:           nil,
	}
	res := s.repository.Validate(mgaStruct)
	require.NotEmpty(s.T(), res)
}

func (s *MetricsGroupActionSuite) TestSaveMetricsGroupAction() {
	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricGroup)

	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}
	s.DB.Create(&actionStruct)

	mgaStruct := metricsgroupaction.MetricsGroupActions{
		BaseModel:           util.BaseModel{},
		Nickname:            "ActionNickname",
		MetricsGroupID:      metricGroup.ID,
		ActionsID:           actionStruct.ID,
		ExecutionParameters: json.RawMessage(`{"exec": "some-param"}`),
		DeletedAt:           nil,
	}

	res, err := s.repository.Save(mgaStruct)

	require.NoError(s.T(), err)
	mgaStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), mgaStruct, res)
}

func (s *MetricsGroupActionSuite) TestSaveMetricsGroupActionError() {
	mgaStruct := metricsgroupaction.MetricsGroupActions{
		BaseModel:           util.BaseModel{},
		Nickname:            "ActionNickname",
		MetricsGroupID:      uuid.New(),
		ActionsID:           uuid.New(),
		ExecutionParameters: json.RawMessage(`{"exec": "some-param"}`),
		DeletedAt:           nil,
	}
	_, err := s.repository.Save(mgaStruct)

	require.Error(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestFindByIdMetricsGroupAction() {
	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricGroup)

	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}
	s.DB.Create(&actionStruct)

	mgaStruct := metricsgroupaction.MetricsGroupActions{
		BaseModel:           util.BaseModel{},
		Nickname:            "ActionNickname",
		MetricsGroupID:      metricGroup.ID,
		ActionsID:           actionStruct.ID,
		ExecutionParameters: json.RawMessage(`{"exec": "some-param"}`),
		DeletedAt:           nil,
	}
	s.DB.Create(&mgaStruct)

	res, err := s.repository.FindById(mgaStruct.ID.String())
	require.NoError(s.T(), err)
	mgaStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), mgaStruct, res)
}

func (s *MetricsGroupActionSuite) TestFindByIdMetricsGroupActionError() {
	_, err := s.repository.FindById(uuid.New().String())
	require.Error(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestFindAllMetricsGroupAction() {
	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricGroup)

	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}
	s.DB.Create(&actionStruct)

	mgaStruct := metricsgroupaction.MetricsGroupActions{
		BaseModel:           util.BaseModel{},
		Nickname:            "ActionNickname",
		MetricsGroupID:      metricGroup.ID,
		ActionsID:           actionStruct.ID,
		ExecutionParameters: json.RawMessage(`{"exec": "some-param"}`),
		DeletedAt:           nil,
	}
	s.DB.Create(&mgaStruct)

	res, err := s.repository.FindAll()

	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
	mgaStruct.BaseModel = res[0].BaseModel
	require.Equal(s.T(), mgaStruct, res[0])
}

func (s *MetricsGroupActionSuite) TestFindAllMetricsGroupActionError() {
	s.DB.Close()
	_, err := s.repository.FindAll()
	require.Error(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestDeleteMetricsGroupAction() {
	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricGroup)

	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}
	s.DB.Create(&actionStruct)

	mgaStruct := metricsgroupaction.MetricsGroupActions{
		BaseModel:           util.BaseModel{},
		Nickname:            "ActionNickname",
		MetricsGroupID:      metricGroup.ID,
		ActionsID:           actionStruct.ID,
		ExecutionParameters: json.RawMessage(`{"exec": "some-param"}`),
		DeletedAt:           nil,
	}
	s.DB.Create(&mgaStruct)

	err := s.repository.Delete(mgaStruct.ID.String())
	require.NoError(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestDeleteMetricsGroupActionError() {
	s.DB.Close()
	err := s.repository.Delete(uuid.New().String())
	require.Error(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestUpdateMetricsGroupAction() {
	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricGroup)

	actionStruct := action.Action{
		Nickname:      "ActionName",
		Type:          "CircleUp",
		Configuration: json.RawMessage(`{"config": "some-config"}`),
		WorkspaceId:   uuid.New().String(),
		DeletedAt:     nil,
	}
	s.DB.Create(&actionStruct)

	mgaStruct := metricsgroupaction.MetricsGroupActions{
		BaseModel:           util.BaseModel{},
		Nickname:            "ActionNickname",
		MetricsGroupID:      metricGroup.ID,
		ActionsID:           actionStruct.ID,
		ExecutionParameters: json.RawMessage(`{"exec": "some-param"}`),
		DeletedAt:           nil,
	}
	s.DB.Create(&mgaStruct)

	mgaStruct.ExecutionParameters = json.RawMessage(`{"update": "eoq"}`)

	res, err := s.repository.Update(mgaStruct.ID.String(), mgaStruct)
	require.NoError(s.T(), err)
	require.Equal(s.T(), mgaStruct.ExecutionParameters, res.ExecutionParameters)
}

func (s *MetricsGroupActionSuite) TestUpdateMetricsGroupActionError() {
	mgaStruct := metricsgroupaction.MetricsGroupActions{}
	s.DB.Close()

	_, err := s.repository.Update("12345", mgaStruct)
	require.Error(s.T(), err)
}
