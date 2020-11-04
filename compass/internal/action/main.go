/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package action

import (
	"compass/internal/plugin"
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateAction(action Action) []util.ErrorUtil
	ParseAction(action io.ReadCloser) (Action, error)
	FindActionByIdAndWorkspace(id string, workspaceID string) (Action, error)
	FindActionById(id string) (Action, error)
	FindAllActionsByWorkspace(workspaceID string) ([]Action, error)
	SaveAction(action Action) (Action, error)
	DeleteAction(id string) error
}

type Main struct {
	db         *gorm.DB
	pluginRepo plugin.UseCases
}

func NewMain(db *gorm.DB, pluginRepo plugin.UseCases) UseCases {
	return Main{db, pluginRepo}
}
