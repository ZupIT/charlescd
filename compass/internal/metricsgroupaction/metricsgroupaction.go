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
	Nickname            string          `json:"nickname"`
	MetricsGroupID      uuid.UUID       `json:"metricsGroupId"`
	ActionID            uuid.UUID       `json:"actionId"`
	ExecutionParameters json.RawMessage `json:"executionParameters"`
	DeletedAt           *time.Time      `json:"-"`
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
			Error: errors.New("Action nickname is required").Error(),
		})
	}

	if metricsGroupAction.ExecutionParameters == nil || len(metricsGroupAction.ExecutionParameters) == 0 {
		ers = append(ers, util.ErrorUtil{
			Field: "executionParameters",
			Error: errors.New("Execution parameters is required").Error(),
		})
	}

	return ers
}

func (main Main) Save(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error) {
	db := main.db.Create(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.SaveActionError, "Save", db.Error, metricsGroupAction)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) FindById(id string) (MetricsGroupAction, error) {
	metricsGroupAction := MetricsGroupAction{}
	db := main.db.Set("gorm:auto_preload", true).First(&metricsGroupAction, id)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindById", db.Error, "Id = "+id)
		return MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) FindAll() ([]MetricsGroupAction, error) {
	var metricsGroupAction []MetricsGroupAction

	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindAll", db.Error, metricsGroupAction)
		return []MetricsGroupAction{}, db.Error
	}
	return metricsGroupAction, nil
}

func (main Main) Delete(id string) error {
	db := main.db.Model(&MetricsGroupAction{}).Where("id = ?", id).Delete(&MetricsGroupAction{})
	if db.Error != nil {
		logger.Error(util.DeleteActionError, "Delete", db.Error, "Id = "+id)
		return db.Error
	}
	return nil
}
