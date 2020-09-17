package action

import (
	"compass/internal/util"
	"compass/pkg/logger"
	"encoding/json"
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
	return nil
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
