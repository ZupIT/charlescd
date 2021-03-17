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
	"encoding/json"
	"fmt"
	"github.com/sirupsen/logrus"
	"github.com/streadway/amqp"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"strconv"
	"time"
)

func (main *Main) Consume(queue string) {
	fmt.Println("[Consumer] Queue: "+queue+" Time: " + time.Now().String())
	startTime := time.Now()
	consumerName := consumerName(queue)

	messages, err := main.amqpClient.Stream(consumerName, queue)
	if err != nil {
		logrus.Error(err)
		main.amqpClient.Close(consumerName)
	}

	go func() {
		for message := range messages {
			messageResponse, err := parseMessage(message)
			if err != nil {
				main.amqpClient.LogAndNack(message, startTime, "error parse message: %s - %s", string(message.Body), err.Error())
				main.amqpClient.Close(consumerName)
				return
			}

			webhookErr := main.subscriptionMain.SendWebhookEvent(messageResponse)
			if webhookErr != nil {
				logrus.Error(webhookErr.Error())
				main.updateMessageInfo(messageResponse, deliveredFailed, webhookErr.Error().Detail, extractHttpStatus(webhookErr))
			} else {
				main.updateMessageInfo(messageResponse, delivered, successLog, 200)
			}

			main.amqpClient.LogAndAck(message, messageResponse, queue)
			main.amqpClient.Close(consumerName)
		}
	}()
}

func parseMessage(msg amqp.Delivery) (payloads.MessageResponse, error) {
	var messageResponse payloads.MessageResponse
	err := json.Unmarshal(msg.Body, &messageResponse)
	return messageResponse, err
}

func extractHttpStatus(err errors.Error) int {
	httpStatus, aErr := strconv.Atoi(err.Error().Meta["http-status"])
	if aErr != nil {
		logrus.Error(aErr)
	}
	return httpStatus
}

func consumerName(queue string) string {
	return fmt.Sprintf("%v-%d", queue, time.Now().Nanosecond())
}
