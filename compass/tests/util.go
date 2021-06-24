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
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/util"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
	tc "github.com/testcontainers/testcontainers-go"
	"gorm.io/gorm"
	"log"
	"strings"
	"time"
)

const dbLog = false

const bigString = `That's is a big Field-Value, probably with more than 100 characters. We are testing the validate method. Now, we have fields that can be filled with more than 300 characters. So, we need more characters here...                                                                                                                                                                          . `

func setupEnv() error {
	composeFilePaths := []string {"resources/docker-compose.test.yaml"}
	identifier := strings.ToLower(uuid.New().String())

	compose := tc.NewLocalDockerCompose(composeFilePaths, identifier)
	execError := compose.
		WithCommand([]string{"up", "-d"}).
		WithEnv(map[string]string {
			"ENV": "TEST",
			"PLUGINS_DIR": "../../dist",
		}).
		Invoke()
	err := execError.Error
	if err != nil {
		return fmt.Errorf("Could not run compose file: %v - %v", composeFilePaths, err)
	}
	return nil
}

func prepareTestDatabases(){
	persistenceManager, err := cmd.prepareDatabase()
	if err != nil {
		log.Fatal(err)
	}
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

func newBasicMetricGroup() domain.MetricsGroup {
	return domain.MetricsGroup{
		Name:        "Name",
		Metrics:     nil,
		WorkspaceID: uuid.New(),
		CircleID:    uuid.New(),
		Actions:     nil,
	}
}

func newBasicDatasource() domain.Datasource {
	return domain.Datasource{
		Name:        "Name",
		PluginSrc:   "src.so",
		Data:        json.RawMessage(`{"someProperty": "someValue"}`),
		WorkspaceID: uuid.New(),
	}
}

func datasourceInsert(pluginSrc string) (string, domain.Datasource) {
	entity := domain.Datasource{
		BaseModel: util.BaseModel{
			ID: uuid.New(),
		},
		Name:        "Name",
		PluginSrc:   pluginSrc,
		Data:        json.RawMessage(`{"url": "http://localhost:9090"}`),
		WorkspaceID: uuid.New(),
	}

	return fmt.Sprintf(`INSERT INTO data_sources (id, name, data, workspace_id,  deleted_at, plugin_src)
							VALUES ('%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), '%s', null, '%s');`,
		entity.ID, entity.Name, entity.Data, configuration.Get("ENCRYPTION_KEY"), entity.WorkspaceID, pluginSrc), entity
}

func newBasicMetric() domain.Metric {
	return domain.Metric{
		Nickname:        "Nickname",
		Query:           "some query",
		Metric:          "some metric name",
		Filters:         []datasourcePKG.MetricFilter{},
		GroupBy:         []domain.MetricGroupBy{},
		Condition:       "=",
		Threshold:       5,
		CircleID:        uuid.New(),
		MetricExecution: domain.MetricExecution{},
	}
}

func newBasicAction() domain.Action {
	return domain.Action{
		WorkspaceId:   uuid.New(),
		Nickname:      "nickname",
		Type:          "validaction",
		Description:   "Some description",
		Configuration: json.RawMessage(`{"someProperty": "someValue"}`),
	}
}

func actionInsert(actionType string) (string, domain.Action) {
	entity := domain.Action{
		BaseModel: util.BaseModel{
			ID: uuid.New(),
		},
		WorkspaceId:   uuid.New(),
		Nickname:      "nickname",
		Type:          "validaction",
		Description:   "Some description",
		Configuration: json.RawMessage(`{"someProperty": "someValue"}`),
	}

	return fmt.Sprintf(`INSERT INTO actions (id, workspace_id, nickname, type, description, configuration, deleted_at)
			VALUES ('%s', '%s', '%s', '%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), null);`,
			entity.ID, entity.WorkspaceId, entity.Nickname, actionType, entity.Description, entity.Configuration, configuration.Get("ENCRYPTION_KEY")),
		entity
}

func newBasicActionRequest() domain.Action {
	return domain.Action{
		WorkspaceId:   uuid.New(),
		Nickname:      "nickname",
		Type:          "validaction",
		Description:   "Some description",
		Configuration: json.RawMessage(`{"someProperty": "someValue"}`),
	}
}

func newBasicConfig() json.RawMessage {
	config, _ := json.Marshal(`{"someProperty": "someValue"}`)
	return config
}

func newBasicGroupAction() domain.MetricsGroupAction {
	return domain.MetricsGroupAction{
		Nickname:             "Nickname",
		ExecutionParameters:  json.RawMessage(`{"someProperty": "someValue"}`),
		ActionsConfiguration: domain.ActionsConfiguration{},
	}
}

func newBasicActionExecution() domain.ActionsExecutions {
	now := time.Now()
	return domain.ActionsExecutions{
		Status:    "IN_EXECUTION",
		StartedAt: &now,
	}
}



