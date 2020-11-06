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

package metric

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	ParseMetric(metric io.ReadCloser) (Metric, error)
	CountMetrics(metrics []Metric) (int, int, int)
	FindMetricById(id string) (Metric, error)
	SaveMetric(metric Metric) (Metric, error)
	UpdateMetric(id string, metric Metric) (Metric, error)
	RemoveMetric(id string) error
	Query(metric Metric, period, interval datasourcePKG.Period) (interface{}, error)
	ResultQuery(metric Metric) (float64, error)
	UpdateMetricExecution(metricExecution MetricExecution) (MetricExecution, error)
	FindAllMetricExecutions() ([]MetricExecution, error)
	Validate(metric Metric) []util.ErrorUtil
	ValidateIfExecutionReached(metric MetricExecution) bool
	FindAllByGroup(metricGroupID string) ([]Metric, error)
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
