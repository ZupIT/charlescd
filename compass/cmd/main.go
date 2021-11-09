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

package main

import (
	"golang.org/x/sync/errgroup"
	"log"
	"time"

	"github.com/casbin/casbin/v2"

	utils "github.com/ZupIT/charlescd/compass/internal/util"

	"strconv"

	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/dispatcher"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/web/api"
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
	"github.com/sirupsen/logrus"

	"github.com/joho/godotenv"
)

func main() {
	var group errgroup.Group
	godotenv.Load()

	logrus.SetFormatter(&logrus.JSONFormatter{})

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

	lmt := configureRequestLimiter()

	if utils.IsDeveloperRunning() {
		db.LogMode(true)
		mooveDb.LogMode(true)
	}

	mooveMain := moove.NewMain(mooveDb)
	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(db, pluginMain)
	metricMain := metric.NewMain(db, datasourceMain, pluginMain)
	actionMain := action.NewMain(db, pluginMain)
	metricsGroupActionMain := metricsgroupaction.NewMain(db, pluginMain, actionMain)
	metricsgroupMain := metricsgroup.NewMain(db, metricMain, datasourceMain, pluginMain, metricsGroupActionMain)
	metricDispatcher := dispatcher.NewDispatcher(metricMain)
	actionDispatcher := dispatcher.NewActionDispatcher(metricsgroupMain, actionMain, pluginMain, metricMain, metricsGroupActionMain)

	stopChan := make(chan bool)

	group.Go(func() error {
		return metricDispatcher.Start(stopChan)
	})
	group.Go(func() error {
		return actionDispatcher.Start(stopChan)
	})

	router := api.NewAPI(
		enforcer,
		lmt,
		pluginMain,
		datasourceMain,
		metricMain,
		actionMain,
		metricsGroupActionMain,
		metricsgroupMain,
		mooveMain,
	)

	api.Start(router)

	if err := group.Wait(); err != nil {
		logrus.Fatal(err)
	}
}

func configureRequestLimiter() *limiter.Limiter {
	reqLimit, err := strconv.ParseFloat(configuration.GetConfiguration("REQUESTS_PER_SECOND_LIMIT"), 64)
	if err != nil {
		log.Fatal(err)
	}

	tokenTTL, err := strconv.Atoi(configuration.GetConfiguration("LIMITER_TOKEN_TTL"))
	if err != nil {
		log.Fatal(err)
	}

	headersTTL, err := strconv.Atoi(configuration.GetConfiguration("LIMITER_HEADERS_TTL"))
	if err != nil {
		log.Fatal(err)
	}

	lmt := tollbooth.NewLimiter(reqLimit, nil)
	lmt.SetTokenBucketExpirationTTL(time.Duration(tokenTTL) * time.Minute)
	lmt.SetHeaderEntryExpirationTTL(time.Duration(headersTTL) * time.Minute)

	return lmt
}
