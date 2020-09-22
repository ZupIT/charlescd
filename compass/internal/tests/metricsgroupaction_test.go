package tests

import (
	"compass/internal/action"
	"compass/internal/configuration"
	metric2 "compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/metricsgroupaction"
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
	mga        metricsgroupaction.MetricsGroupAction
}

func (s *MetricsGroupActionSuite) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *MetricsGroupActionSuite) BeforeTest(suiteName, testName string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	s.repository = metricsgroupaction.NewMain(s.DB)
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

func (s *MetricsGroupActionSuite) TestParseMetricsGroupAction() {
	stringReader := strings.NewReader(`{
    "nickname": "ExecutionName",
    "metricsGroupId": "8800ba87-94e9-443e-9e10-59efe8c58706",
    "actionsId": "f1fbe330-c7f6-4215-8311-83015b8df761",
    "executionParameters": {
        "circleId": "123456789"
    }
}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.Parse(stringReadCloser)

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *MetricsGroupActionSuite) TestParseMetricsGroupActionError() {
	stringReader := strings.NewReader(``)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.Parse(stringReadCloser)
	require.Error(s.T(), err)
}

func (s *MetricsGroupActionSuite) TestValidateMetricsGroupAction() {
	mgaStruct := metricsgroupaction.MetricsGroupAction{
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

	mgaStruct := metricsgroupaction.MetricsGroupAction{
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
	mgaStruct := metricsgroupaction.MetricsGroupAction{
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

	mgaStruct := metricsgroupaction.MetricsGroupAction{
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

	mgaStruct := metricsgroupaction.MetricsGroupAction{
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

	mgaStruct := metricsgroupaction.MetricsGroupAction{
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

	mgaStruct := metricsgroupaction.MetricsGroupAction{
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
	mgaStruct := metricsgroupaction.MetricsGroupAction{}
	s.DB.Close()

	_, err := s.repository.Update("12345", mgaStruct)
	require.Error(s.T(), err)
}
