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
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"hermes/internal/configuration"
	"hermes/internal/notification/message"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/notification/publisher"
	"hermes/internal/subscription"
	"hermes/queueprotocol"
	"hermes/web/api"
	"log"
	"os"
)

func main() {
	godotenv.Load()

	db, err := configuration.GetDBConnection("migrations")
	if err != nil {
		log.Fatal(err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal(err)
	}

	goChan := make(chan os.Signal, 1)
	amqpClient := queueprotocol.NewClient(
		configuration.GetConfiguration("AMQP_LISTEN_QUEUE"),
		configuration.GetConfiguration("AMQP_PUSH_QUEUE"),
		configuration.GetConfiguration("AMQP_URL"),
		logrus.New(),
		goChan,
	)

	subscriptionMain := subscription.NewMain(db)
	messageExecutionMain := messageexecutionhistory.NewMain(db)
	messageMain := message.NewMain(db, amqpClient, messageExecutionMain)
	messagePublisher := publisher.NewMain(db, amqpClient, messageMain, messageExecutionMain)

	stopChan := make(chan bool, 0)
	go messagePublisher.Start(stopChan)

	router := api.NewApi(subscriptionMain, messageMain, messageExecutionMain, sqlDB)
	api.Start(router)
}
