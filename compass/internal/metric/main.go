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

package metric

import (
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	ParseMetric(metric io.ReadCloser) (Metric, errors.Error)
	CountMetrics(metrics []Metric) (int, int, int)
	FindMetricByID(id string) (Metric, errors.Error)
	SaveMetric(metric Metric) (Metric, errors.Error)
	UpdateMetric(metric Metric) (Metric, errors.Error)
	RemoveMetric(id string) errors.Error
	Query(metric Metric, period, interval datasourcePKG.Period) (interface{}, errors.Error)
	ResultQuery(metric Metric) (float64, errors.Error)
	UpdateMetricExecution(metricExecution MetricExecution) (MetricExecution, errors.Error)
	FindAllMetricExecutions() ([]MetricExecution, errors.Error)
	Validate(metric Metric) errors.ErrorList
	ValidateIfExecutionReached(metric MetricExecution) bool
	FindAllByGroup(metricGroupID string) ([]Metric, errors.Error)
}

type Main struct {
	db             *gorm.DB
	datasourceMain datasource.UseCases
	pluginMain     plugin.UseCases
}

func NewMain(
	db *gorm.DB, datasourceMain datasource.UseCases, pluginMain plugin.UseCases,
) UseCases {
	return Main{db, datasourceMain, pluginMain}
}
