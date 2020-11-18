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

package tests

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"os"
	"time"
)

const dbLog = false

const bigString = `That's is a big Field-Value, probably with more than 100 characters. We are testing the validate method.`

func setupEnv() {
	os.Setenv("ENV", "TEST")
	os.Setenv("PLUGINS_DIR", "../../dist")
}

func clearDatabase(db *gorm.DB) {
	db.Exec("DELETE FROM actions_executions")
	db.Exec("DELETE FROM actions_configurations")
	db.Exec("DELETE FROM metrics_group_actions")
	db.Exec("DELETE FROM metric_executions")
	db.Exec("DELETE FROM metric_filters")
	db.Exec("DELETE FROM metric_group_bies")
	db.Exec("DELETE FROM metrics")
	db.Exec("DELETE FROM metrics_groups")
	db.Exec("DELETE FROM actions")
	db.Exec("DELETE FROM data_sources")
}

func newBasicMetricGroup() metricsgroup.MetricsGroup {
	return metricsgroup.MetricsGroup{
		Name:        "Name",
		Metrics:     nil,
		WorkspaceID: uuid.New(),
		CircleID:    uuid.New(),
		Actions:     nil,
	}
}

func newBasicDatasource() datasource.DataSource {
	return datasource.DataSource{
		Name:        "Name",
		PluginSrc:   "src.so",
		Health:      false,
		Data:        json.RawMessage(`{"someProperty": "someValue"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}
}

func newBasicMetric() metric.Metric {
	return metric.Metric{
		Nickname:        "Nickname",
		Query:           "some query",
		Metric:          "some metric name",
		Filters:         []datasourcePKG.MetricFilter{},
		GroupBy:         []metric.MetricGroupBy{},
		Condition:       "=",
		Threshold:       5,
		CircleID:        uuid.New(),
		MetricExecution: metric.MetricExecution{},
	}
}

func newBasicAction() action.Action {
	return action.Action{
		WorkspaceId:   uuid.New(),
		Nickname:      "nickname",
		Type:          "validaction",
		Description:   "Some description",
		Configuration: json.RawMessage(`{"someProperty": "someValue"}`),
		DeletedAt:     nil,
	}
}

func newBasicConfig() json.RawMessage {
	config, _ := json.Marshal(`{"someProperty": "someValue"}`)
	return config
}

func newBasicGroupAction() metricsgroupaction.MetricsGroupAction {
	return metricsgroupaction.MetricsGroupAction{
		Nickname:             "Nickname",
		ExecutionParameters:  json.RawMessage(`{"someProperty": "someValue"}`),
		ActionsConfiguration: metricsgroupaction.ActionsConfiguration{},
		DeletedAt:            nil,
	}
}

func newBasicActionExecution() metricsgroupaction.ActionsExecutions {
	now := time.Now()
	return metricsgroupaction.ActionsExecutions{
		Status:    "IN_EXECUTION",
		StartedAt: &now,
	}
}
