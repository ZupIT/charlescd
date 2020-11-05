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

package metricsgroupaction

import (
	"compass/internal/action"
	"compass/internal/plugin"
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateGroupAction(metricsGroupAction MetricsGroupAction, workspaceID string) []util.ErrorUtil
	ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupAction, error)
	FindGroupActionById(id string) (MetricsGroupAction, error)
	SaveGroupAction(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error)
	ListGroupActionExecutionResumeByGroup(groupID string) ([]GroupActionExecutionStatusResume, error)
	UpdateGroupAction(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error)
	DeleteGroupAction(id string) error
	SetExecutionFailed(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	SetExecutionSuccess(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupAction) bool
	CreateNewExecution(groupActionID string) (ActionsExecutions, error)
}

type Main struct {
	db         *gorm.DB
	pluginRepo plugin.UseCases
	actionRepo action.UseCases
}

func NewMain(db *gorm.DB, pluginRepo plugin.UseCases, actionRepo action.UseCases) UseCases {
	return Main{db, pluginRepo, actionRepo}
}
