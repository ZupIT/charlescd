package metricsgroupaction

import (
	"compass/internal/util"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"io"
	"time"
)

type MetricsGroupAction struct {
	util.BaseModel
	MetricsGroupID      uuid.UUID             `json:"metricsGroupId"`
	ActionID            uuid.UUID             `json:"actionId"`
	Nickname            string                `json:"nickname"`
	ExecutionParameters json.RawMessage       `json:"executionParameters"`
	DeletedAt           time.Time             `json:"-"`
	Configuration       ActionsConfigurations `json:"configuration"`
}

type ActionsConfigurations struct {
	util.BaseModel
	MetricActionId uuid.UUID `json:"-"`
	Repeatable     bool      `json:"repeatable"`
	NumberOfCycles int16     `json:"numberOfCycles"`
}

func (main Main) ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupAction, error) {
	var mgAct *MetricsGroupAction

	err := json.NewDecoder(metricsGroupAction).Decode(&mgAct)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, mgAct)
		return MetricsGroupAction{}, err
	}

	return *mgAct, nil
}

func (main Main) ValidateGroupAction(metricsGroupAction MetricsGroupAction) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)
	needConfigValidation := true

	if metricsGroupAction.Nickname == "" {
		ers = append(ers, util.ErrorUtil{
			Field: "nickname",
			Error: errors.New("action nickname is required").Error(),
		})
	}

	if metricsGroupAction.ExecutionParameters == nil || len(metricsGroupAction.ExecutionParameters) == 0 {
		needConfigValidation = false
		ers = append(ers, util.ErrorUtil{
			Field: "executionParameters",
			Error: errors.New("execution parameters is required").Error(),
		})
	}

	act, err := main.actionRepo.FindActionById(metricsGroupAction.ActionID.String())
	if err != nil || act.Type == "" {
		needConfigValidation = false
		logger.Error("error finding action", "ValidateGroupAction", err, metricsGroupAction.ActionID.String())
		ers = append(ers, util.ErrorUtil{
			Field: "actionId",
			Error: errors.New("action is invalid").Error(),
		})
	}

	if needConfigValidation {
		ers = append(ers, main.validateExecutionConfig(act.Type, metricsGroupAction.ExecutionParameters)...)
	}

	return ers
}

func (main Main) ValidateJobConfiguration(configuration ActionsConfigurations) []util.ErrorUtil {
	errs := make([]util.ErrorUtil, 0)

	if configuration.NumberOfCycles < 0 {
		errs = append(errs, util.ErrorUtil{Field: "configuration.NumberOfCycles", Error: "the number of cycle needs an positive integer"})
	}

	if configuration.Repeatable == false && configuration.NumberOfCycles == 0 {
		errs = append(errs, util.ErrorUtil{Field: "configuration.Repeatable", Error: "a not repeatable action needs a defined number of cycles"})
	}

	return errs
}

func (main Main) validateExecutionConfig(actionType string, executionConfiguration json.RawMessage) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	plugin, err := main.pluginRepo.GetPluginBySrc(actionType)
	if err != nil {
		logger.Error("error finding plugin", "ValidateExecutionConfig", err, actionType)
		return []util.ErrorUtil{{Field: "actionId", Error: errors.New("action is invalid").Error()}}
	}

	pluginErrs, err := plugin.Lookup("ValidateExecutionConfiguration")
	if err != nil {
		logger.Error("error looking up for plugin", "ValidateExecutionConfig", err, fmt.Sprintf("%+v", plugin))
		return []util.ErrorUtil{{Field: "actionId", Error: errors.New("action is invalid").Error()}}
	}

	configErs := pluginErrs.(func(executionConfig []byte) []error)(executionConfiguration)
	if len(configErs) > 0 {
		for _, err := range configErs {
			ers = append(ers, util.ErrorUtil{Field: "executionParameters", Error: err.Error()})
		}
	}

	return ers
}

func (main Main) SaveGroupAction(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error) {
	db := main.db.Create(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.SaveActionError, "SaveAction", db.Error, metricsGroupAction)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) UpdateGroupAction(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error) {
	db := main.db.Table("metrics_group_actions").Where("id = ?", id).Update("nickname", metricsGroupAction.Nickname, "executionConfiguration", metricsGroupAction.ExecutionParameters)
	if db.Error != nil {
		logger.Error(util.UpdateActionError, "UpdateAction", db.Error, metricsGroupAction)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) FindGroupActionById(id string) (MetricsGroupAction, error) {
	metricsGroupAction := MetricsGroupAction{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindActionById", db.Error, "Id = "+id)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) FindAllGroupActions() ([]MetricsGroupAction, error) {
	var metricsGroupAction []MetricsGroupAction

	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindAllActions", db.Error, metricsGroupAction)
		return []MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) DeleteGroupAction(id string) error {
	db := main.db.Model(&MetricsGroupAction{}).Where("id = ?", id).Delete(&MetricsGroupAction{})
	if db.Error != nil {
		logger.Error(util.DeleteActionError, "DeleteAction", db.Error, "Id = "+id)
		return db.Error
	}
	return nil
}

func (main Main) SaveGroupActionConfiguration(configuration ActionsConfigurations) (ActionsConfigurations, error) {
	db := main.db.Create(&configuration)
	if db.Error != nil {
		logger.Error(util.SaveActionConfigurationError, "SaveActionConfiguration", db.Error, configuration)
		return ActionsConfigurations{}, db.Error
	}
	return configuration, nil
}

func (main Main) ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupAction) bool {
	return metricsGroupAction.Configuration.Repeatable || int64(metricsGroupAction.Configuration.NumberOfCycles) > main.getNumberOfActionExecutions(metricsGroupAction.ID)
}
