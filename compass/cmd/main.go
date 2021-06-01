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
	"log"
	"strconv"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

func main() {
	godotenv.Load()

	logrus.SetFormatter(&logrus.JSONFormatter{})

	persistenceManager, err := prepareDatabase()
	if err != nil {
		log.Fatal(err)
	}

	serviceManager, err := prepareServices()
	if err != nil {
		log.Fatal(err)
	}

	server, err := newServer(persistenceManager, serviceManager)
	if err != nil {
		log.Fatal(err)
	}

	stopChan := make(chan bool, 0)
	go server.pm.metricDispatcher.Start(stopChan)
	go server.pm.actionDispatcher.Start(stopChan)

	lmt := configureRequestLimiter()
	log.Fatalln(server.start("8080"))

	//if utils.IsDeveloperRunning() {
	//	db.LogMode(true)
	//	mooveDb.LogMode(true)
	//}

}

func configureRequestLimiter() *limiter.Limiter {
	reqLimit, err := strconv.ParseFloat(configuration.Get("REQUESTS_PER_SECOND_LIMIT"), 64)
	if err != nil {
		log.Fatal(err)
	}

	tokenTTL, err := strconv.Atoi(configuration.Get("LIMITER_TOKEN_TTL"))
	if err != nil {
		log.Fatal(err)
	}

	headersTTL, err := strconv.Atoi(configuration.Get("LIMITER_HEADERS_TTL"))
	if err != nil {
		log.Fatal(err)
	}

	lmt := tollbooth.NewLimiter(reqLimit, nil)
	lmt.SetTokenBucketExpirationTTL(time.Duration(tokenTTL) * time.Minute)
	lmt.SetHeaderEntryExpirationTTL(time.Duration(headersTTL) * time.Minute)

	return lmt
}
