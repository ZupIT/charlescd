package action

import (
	"compass/internal/util"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"io"
	"time"
)

type Action struct {
	util.BaseModel
	Nickname      string          `json:"nickname"`
	Type          string          `json:"type"`
	Configuration json.RawMessage `json:"configuration"`
	WorkspaceId   string          `json:"workspaceId"`
	DeletedAt     *time.Time      `json:"-"`
}

func (main Main) Parse(action io.ReadCloser) (Action, error) {
	var nAction *Action

	err := json.NewDecoder(action).Decode(&nAction)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, action)
		return Action{}, err
	}

	return *nAction, nil
}

func (main Main) Validate(action Action) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if action.Nickname == "" {
		ers = append(ers, util.ErrorUtil{Field: "nickname", Error: errors.New("Action nickname is required").Error()})
	}

	if action.Type == "" {
		ers = append(ers, util.ErrorUtil{Field: "type", Error: errors.New("Action type is required").Error()})
	}

	if action.Configuration == nil || len(action.Configuration) == 0 {
		ers = append(ers, util.ErrorUtil{Field: "configuration", Error: errors.New("Action configuration is required").Error()})
	}

	if action.WorkspaceId == "" {
		ers = append(ers, util.ErrorUtil{Field: "workspaceId", Error: errors.New("WorkspaceId is required").Error()})
	}

	return ers
}

func (main Main) FindById(id string) (Action, error) {
	action := Action{}
	db := main.db.Set("gorm:auto_preload", true).First(&action, id)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindById", db.Error, "Id = "+id)
		return Action{}, db.Error
	}
	return action, nil
}

func (main Main) FindAll() ([]Action, error) {
	var actions []Action

	db := main.db.Set("gorm:auto_preload", true).Find(&actions)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindAll", db.Error, actions)
		return []Action{}, db.Error
	}
	return actions, nil
}

func (main Main) Save(action Action) (Action, error) {
	db := main.db.Create(&action)
	if db.Error != nil {
		logger.Error(util.SaveActionError, "Save", db.Error, action)
		return Action{}, db.Error
	}
	return action, nil
}

func (main Main) Delete(id string) error {
	db := main.db.Model(&Action{}).Where("id = ?", id).Delete(&Action{})
	if db.Error != nil {
		logger.Error(util.DeleteActionError, "Delete", db.Error, "Id = "+id)
		return db.Error
	}
	return nil
}
