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

package messagePubSub

import (
	"gorm.io/gorm"
	"hermes/internal/notification/message"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/subscription"
	"hermes/rabbitclient"
)

const (
	enqueued        = "ENQUEUED"
	notEnqueued     = "NOT_ENQUEUED"
	delivered       = "DELIVERED"
	deliveredFailed = "DELIVERED_FAILED"
	successLog      = "SUCCESS"
)

type UseCases interface {
	Publish()
	Consume(stopChan chan bool)
}

type Main struct {
	db               *gorm.DB
	amqpClient       *rabbitclient.Client
	messageMain      message.UseCases
	executionMain    messageexecutionhistory.UseCases
	subscriptionMain subscription.UseCases
}

func NewMain(
	db *gorm.DB,
	amqpClient *rabbitclient.Client,
	messageMain message.UseCases,
	executionMain messageexecutionhistory.UseCases,
	subscriptionMain subscription.UseCases) UseCases {
	return &Main{db, amqpClient, messageMain, executionMain, subscriptionMain}
}
