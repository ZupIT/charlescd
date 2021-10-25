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

package messagePubSub

import (
	"encoding/json"
	"github.com/sirupsen/logrus"
	"github.com/streadway/amqp"
	"hermes/internal/configuration"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"strconv"
	"time"
)

func (main *Main) Consume(stopChan chan bool) {
	startTime := time.Now()

	func() {
		for {
			messages, err := main.amqpClient.Stream()
			if err != nil {
				logrus.Error(err.Error())
			}

			for message := range messages {
				messageResponse, err := parseMessage(message)
				if err != nil {
					main.amqpClient.LogAndNack(message, startTime, "error parse message: %s - %s", string(message.Body), err.Error())
				}

				main.sendWebhookEvent(messageResponse)

				main.amqpClient.LogAndAck(message, messageResponse)
			}
		}
	}()

	<-stopChan
}

func parseMessage(msg amqp.Delivery) (payloads.MessageResponse, error) {
	var messageResponse payloads.MessageResponse
	err := json.Unmarshal(msg.Body, &messageResponse)
	return messageResponse, err
}

func (main *Main) sendWebhookEvent(messageResponse payloads.MessageResponse) {
	webhookErr := main.subscriptionMain.SendWebhookEvent(messageResponse)
	if webhookErr != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot send to webhook", "Error to send message").
				WithOperations("SendWebhookEvent"),
		}).Errorln(webhookErr)

		updateMessageErr := main.updateMessageInfo(messageResponse, deliveredFailed, webhookErr.Error().Detail, extractHTTPStatus(webhookErr))
		if updateMessageErr != nil {
			logrus.WithFields(logrus.Fields{
				"err": errors.NewError("Cannot update message", updateMessageErr.Error()).
					WithOperations("SendWebhookEvent"),
			}).Errorln(updateMessageErr)
		}

		if messageResponse.RetryCount < configuration.GetConfigurationAsInt("CONSUMER_MESSAGE_RETRY_ATTEMPTS") {
			sendToWaitQueue(main, messageResponse)
		}
	} else {
		updateMessageErr := main.updateMessageInfo(messageResponse, delivered, successLog, 200)
		if updateMessageErr != nil {
			logrus.WithFields(logrus.Fields{
				"err": errors.NewError("Cannot update message", updateMessageErr.Error()).
					WithOperations("SendWebhookEvent"),
			}).Errorln(updateMessageErr)
		}
	}
}

func extractHTTPStatus(err errors.Error) int {
	httpStatus, aErr := strconv.Atoi(err.Error().Meta["http-status"])
	if aErr != nil {
		logrus.Error(aErr)
	}
	return httpStatus
}

func sendToWaitQueue(main *Main, msg payloads.MessageResponse) {
	msg.RetryCount++
	err := main.sendMessageWithExpiration(msg)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot publish message to wait queue", "Error to publish message").
				WithOperations("sendMessageWithExpiration"),
		}).Errorln(err.Error())
	}
}
