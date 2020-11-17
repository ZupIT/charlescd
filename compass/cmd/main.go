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

package main

import (
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/dispatcher"
	"github.com/ZupIT/charlescd/compass/internal/health"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/didip/tollbooth"
	"log"
	"time"

	utils "github.com/ZupIT/charlescd/compass/internal/util"
	v1 "github.com/ZupIT/charlescd/compass/web/api/v1"

	"github.com/joho/godotenv"

	"github.com/casbin/casbin/v2"
)

func main() {
	godotenv.Load()

	db, err := configuration.GetDBConnection("migrations")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	mooveDb, err := configuration.GetMooveDBConnection()
	if err != nil {
		log.Fatal(err)
	}
	defer mooveDb.Close()

	enforcer, err := casbin.NewEnforcer("./auth.conf", "./policy.csv")
	if err != nil {
		log.Fatal(err)
	}

	if utils.IsDeveloperRunning() {
		db.LogMode(true)
		mooveDb.LogMode(true)
	}

	lmt := tollbooth.NewLimiter(1, nil)
	lmt.SetTokenBucketExpirationTTL(5 * time.Minute)
	lmt.SetHeaderEntryExpirationTTL(5 * time.Minute)

	mooveMain := moove.NewMain(mooveDb)
	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(db, pluginMain)
	metricMain := metric.NewMain(db, datasourceMain, pluginMain)
	actionMain := action.NewMain(db, pluginMain)
	metricsGroupActionMain := metricsgroupaction.NewMain(db, pluginMain, actionMain)
	metricsgroupMain := metricsgroup.NewMain(db, metricMain, datasourceMain, pluginMain, metricsGroupActionMain)
	mooveClient := moove.NewAPIClient(configuration.GetConfiguration("MOOVE_URL"), 15*time.Second)
	healthMain := health.NewMain(db, datasourceMain, pluginMain, mooveClient)
	metricDispatcher := dispatcher.NewDispatcher(metricMain)
	actionDispatcher := dispatcher.NewActionDispatcher(metricsgroupMain, actionMain, pluginMain, metricMain, metricsGroupActionMain)

	stopChan := make(chan bool, 0)
	go metricDispatcher.Start(stopChan)
	go actionDispatcher.Start(stopChan)

	v1Api := v1.NewV1(mooveMain, enforcer, lmt)
	v1Api.NewPluginApi(pluginMain)
	v1Api.NewMetricsGroupApi(metricsgroupMain)
	v1Api.NewMetricApi(metricMain, metricsgroupMain)
	v1Api.NewDataSourceApi(datasourceMain)
	v1Api.NewCircleApi(metricsgroupMain)
	v1Api.NewActionApi(actionMain)
	v1Api.NewHealthApi(healthMain)
	v1Api.NewMetricsGroupActionApi(metricsGroupActionMain)
	v1Api.Start()
}
