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
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
	"github.com/sirupsen/logrus"
	"hermes/internal/configuration"
	"hermes/internal/notification/message"
	"hermes/internal/notification/messagePubSub"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/subscription"
	"hermes/rabbitclient"
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
	amqpClient := rabbitclient.NewClient(
		configuration.GetConfiguration("AMQP_MESSAGE_QUEUE"),
		configuration.GetConfiguration("AMQP_WAIT_MESSAGE_QUEUE"),
		configuration.GetConfiguration("AMQP_MESSAGE_EXCHANGE"),
		configuration.GetConfiguration("AMQP_WAIT_MESSAGE_EXCHANGE"),
		configuration.GetConfiguration("AMQP_MESSAGE_ROUTING_KEY"),
		configuration.GetConfiguration("CONSUMER_MESSAGE_RETRY_EXPIRATION"),
		configuration.GetConfiguration("AMQP_URL"),
		logrus.New(),
		goChan,
	)

	subscriptionMain := subscription.NewMain(db)
	messageExecutionMain := messageexecutionhistory.NewMain(db)
	messageMain := message.NewMain(db, amqpClient, messageExecutionMain)
	messagePubSubMain := messagePubSub.NewMain(db, amqpClient, messageMain, messageExecutionMain, subscriptionMain)

	c := cron.New(cron.WithChain(
		cron.SkipIfStillRunning(cron.DefaultLogger)))
	c.AddFunc(configuration.GetConfiguration("PUBLISHER_TIME"), func() { messagePubSubMain.Publish() })
	go c.Start()

	stopChan := make(chan bool)
	go messagePubSubMain.Consume(stopChan)

	router := api.NewAPI(subscriptionMain, messageMain, messageExecutionMain, sqlDB)
	api.Start(router)
}
