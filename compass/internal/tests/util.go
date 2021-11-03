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

//nolint
package tests

import (
	"encoding/json"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/util"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"os"
	"time"
)

const dbLog = false

const bigString = `That's is a big Field-Value, probably with more than 100 characters. We are testing the validate method. Now, we have fields that can be filled with more than 300 characters. So, we need more characters here...                                                                                                                                                                          . `

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
		Data:        json.RawMessage(`{"someProperty": "someValue"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}
}

func datasourceInsert(pluginSrc string) (string, datasource.Response) {
	entity := datasource.Response{
		BaseModel: util.BaseModel{
			ID: uuid.New(),
		},
		Name:        "Name",
		PluginSrc:   pluginSrc,
		Data:        json.RawMessage(`{"url": "http://localhost:9090"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}

	return fmt.Sprintf(`INSERT INTO data_sources (id, name, data, workspace_id,  deleted_at, plugin_src)
							VALUES ('%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), '%s', null, '%s');`,
		entity.ID, entity.Name, entity.Data, configuration.GetConfiguration("ENCRYPTION_KEY"), entity.WorkspaceID, pluginSrc), entity
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
		WorkspaceID:   uuid.New(),
		Nickname:      "nickname",
		Type:          "validaction",
		Description:   "Some description",
		Configuration: json.RawMessage(`{"someProperty": "someValue"}`),
		DeletedAt:     nil,
	}
}

func actionInsert(actionType string) (string, action.Response) {
	entity := action.Response{
		BaseModel: util.BaseModel{
			ID: uuid.New(),
		},
		WorkspaceID:   uuid.New(),
		Nickname:      "nickname",
		Type:          "validaction",
		Description:   "Some description",
		Configuration: json.RawMessage(`{"someProperty": "someValue"}`),
		DeletedAt:     nil,
	}

	return fmt.Sprintf(`INSERT INTO actions (id, workspace_id, nickname, type, description, configuration, deleted_at)
			VALUES ('%s', '%s', '%s', '%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), null);`,
			entity.ID, entity.WorkspaceID, entity.Nickname, actionType, entity.Description, entity.Configuration, configuration.GetConfiguration("ENCRYPTION_KEY")),
		entity
}

func newBasicActionRequest() action.Request {
	return action.Request{
		WorkspaceID:   uuid.New(),
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
