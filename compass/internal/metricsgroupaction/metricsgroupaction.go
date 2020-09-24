package metricsgroupaction

import (
	"compass/internal/util"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"io"
	"time"
)

type MetricsGroupAction struct {
	util.BaseModel
	Nickname            string                `json:"nickname"`
	MetricsGroupID      uuid.UUID             `json:"metricsGroupId"`
	ActionsID           uuid.UUID             `json:"actionsId"`
	ExecutionParameters json.RawMessage       `json:"executionParameters"`
	DeletedAt           *time.Time            `json:"-"`
	Configuration       ActionsConfigurations `json:"configuration"`
	Executions          []ActionsExecutions   `json:"executions"`
}

type ActionsConfigurations struct {
	util.BaseModel
	MetricActionId string     `json:"metricActionId"`
	Repeatable     bool       `json:"repeatable"`
	NumberOfCycles int8       `json:"numberOfCycles"`
	DeletedAt      *time.Time `json:"-"`
}

func (main Main) Parse(metricsGroupAction io.ReadCloser) (MetricsGroupAction, error) {
	var mgAct *MetricsGroupAction

	err := json.NewDecoder(metricsGroupAction).Decode(&mgAct)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, mgAct)
		return MetricsGroupAction{}, err
	}

	return *mgAct, nil
}

func (main Main) Validate(metricsGroupAction MetricsGroupAction) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if metricsGroupAction.Nickname == "" {
		ers = append(ers, util.ErrorUtil{
			Field: "nickname",
			Error: errors.New("action nickname is required").Error(),
		})
	}

	if metricsGroupAction.ExecutionParameters == nil || len(metricsGroupAction.ExecutionParameters) == 0 {
		ers = append(ers, util.ErrorUtil{
			Field: "executionParameters",
			Error: errors.New("execution parameters is required").Error(),
		})
	}

	return ers
}

func (main Main) Save(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error) {
	db := main.db.Create(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.SaveActionError, "SaveAction", db.Error, metricsGroupAction)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) Update(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error) {
	db := main.db.Table("metrics_group_actions").Where("id = ?", id).Update(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.UpdateActionError, "UpdateAction", db.Error, metricsGroupAction)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) FindById(id string) (MetricsGroupAction, error) {
	metricsGroupAction := MetricsGroupAction{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindActionById", db.Error, "Id = "+id)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) FindAll() ([]MetricsGroupAction, error) {
	var metricsGroupAction []MetricsGroupAction

	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindAllActions", db.Error, metricsGroupAction)
		return []MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) Delete(id string) error {
	db := main.db.Model(&MetricsGroupAction{}).Where("id = ?", id).Delete(&MetricsGroupAction{})
	if db.Error != nil {
		logger.Error(util.DeleteActionError, "DeleteAction", db.Error, "Id = "+id)
		return db.Error
	}
	return nil
}
