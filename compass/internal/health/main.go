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

package health

import (
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Components(circleIDHeader, circleId, projectionType, metricType string, workspaceID uuid.UUID) (ComponentMetricRepresentation, errors.Error)
	ComponentsHealth(circleIDHeader, circleId string, workspaceID uuid.UUID) (CircleHealthRepresentation, errors.Error)
}

type Main struct {
	db         *gorm.DB
	datasource datasource.UseCases
	pluginMain plugin.UseCases
	mooveMain  moove.ApiUseCases
}

func NewMain(db *gorm.DB, datasource datasource.UseCases, pluginMain plugin.UseCases, mooveMain moove.ApiUseCases) UseCases {
	return Main{db, datasource, pluginMain, mooveMain}
}
