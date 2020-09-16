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

package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/metric"
	"compass/internal/plugin"
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	PeriodValidate(currentPeriod string) error
	Parse(metricsGroup io.ReadCloser) (MetricsGroup, error)
	FindAll() ([]MetricsGroup, error)
	ResumeByCircle(circleId string) ([]MetricGroupResume, error)
	Save(metricsGroup MetricsGroup) (MetricsGroup, error)
	FindById(id string) (MetricsGroup, error)
	Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error)
	Remove(id string) error
	QueryByGroupID(id, period, interval string) ([]datasourcePKG.MetricValues, error)
	ResultByGroup(group MetricsGroup) ([]datasourcePKG.MetricResult, error)
	ResultByID(id string) ([]datasourcePKG.MetricResult, error)
	FindCircleMetricGroups(circleId string) ([]MetricsGroup, error)
	Validate(metricsGroup MetricsGroup) []util.ErrorUtil
}

type Main struct {
	db             *gorm.DB
	metricMain     metric.UseCases
	datasourceMain datasource.UseCases
	pluginMain     plugin.UseCases
}

func NewMain(
	db *gorm.DB, metricMain metric.UseCases, datasourceMain datasource.UseCases, pluginMain plugin.UseCases,
) UseCases {
	return Main{db, metricMain, datasourceMain, pluginMain}
}
