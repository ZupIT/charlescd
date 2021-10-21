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

package metricsgroup

import (
	"github.com/google/uuid"
	"io"

	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	PeriodValidate(currentPeriod string) (datasourcePKG.Period, errors.Error)
	Parse(metricsGroup io.ReadCloser) (MetricsGroup, errors.Error)
	FindAll() ([]MetricsGroup, errors.Error)
	FindAllByWorkspaceID(workspaceID uuid.UUID) ([]MetricsGroup, errors.Error)
	ResumeByCircle(circleID string) ([]MetricGroupResume, errors.Error)
	Save(metricsGroup MetricsGroup) (MetricsGroup, errors.Error)
	FindByID(id string) (MetricsGroup, errors.Error)
	Update(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error)
	UpdateName(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error)
	Remove(id string) errors.Error
	QueryByGroupID(id string, period, interval datasourcePKG.Period) ([]datasourcePKG.MetricValues, errors.Error)
	ResultByGroup(group MetricsGroup) ([]datasourcePKG.MetricResult, errors.Error)
	ResultByID(id string) ([]datasourcePKG.MetricResult, errors.Error)
	ListAllByCircle(circleID string) ([]MetricsGroupRepresentation, errors.Error)
	Validate(metricsGroup MetricsGroup) errors.ErrorList
}

type Main struct {
	db               *gorm.DB
	metricMain       metric.UseCases
	datasourceMain   datasource.UseCases
	pluginMain       plugin.UseCases
	groupActionsMain metricsgroupaction.UseCases
}

func NewMain(
	db *gorm.DB, metricMain metric.UseCases, datasourceMain datasource.UseCases, pluginMain plugin.UseCases, groupActionsMain metricsgroupaction.UseCases,
) UseCases {
	return Main{db, metricMain, datasourceMain, pluginMain, groupActionsMain}
}
