/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateGroupAction(metricsGroupAction MetricsGroupAction, workspaceID uuid.UUID) errors.ErrorList
	ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupAction, errors.Error)
	FindGroupActionByID(id string) (MetricsGroupAction, errors.Error)
	SaveGroupAction(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, errors.Error)
	ListGroupActionExecutionResumeByGroup(groupID string) ([]GroupActionExecutionStatusResume, errors.Error)
	UpdateGroupAction(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, errors.Error)
	DeleteGroupAction(id string) errors.Error
	SetExecutionFailed(actionExecutionID string, executionLog string) (ActionsExecutions, errors.Error)
	SetExecutionSuccess(actionExecutionID string, executionLog string) (ActionsExecutions, errors.Error)
	ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupAction) bool
	CreateNewExecution(groupActionID string) (ActionsExecutions, errors.Error)
}

type Main struct {
	db         *gorm.DB
	pluginRepo plugin.UseCases
	actionRepo action.UseCases
}

func NewMain(db *gorm.DB, pluginRepo plugin.UseCases, actionRepo action.UseCases) UseCases {
	return Main{db, pluginRepo, actionRepo}
}
