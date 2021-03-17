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
	"github.com/sirupsen/logrus"
	"hermes/internal/configuration"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"strconv"
)

func (main *Main) Consume(stopSub chan bool) {
	response := make(chan payloads.MessageResponse, 0)

	func() {
		for {
			go main.amqpClient.Stream(response, configuration.GetConfiguration("AMQP_MESSAGE_QUEUE"))
			msg := <-response
			err := main.subscriptionMain.SendWebhookEvent(msg)
			if err != nil {
				logrus.WithFields(logrus.Fields{
					"err": errors.NewError("Cannot send to webhook", "Error to send message").
						WithOperations("SendWebhookEvent"),
				}).Errorln()
				logrus.Error(err)

				main.updateMessageInfo(msg, deliveredFailed, err.Error().Detail, extractHttpStatus(err))

				if msg.RetryCount < configuration.GetConfigurationAsInt("CONSUMER_MESSAGE_RETRY_ATTEMPTS") {
					sendToWaitQueue(main, msg)
				}

			} else {
				main.updateMessageInfo(msg, delivered, successLog, 200)
			}
		}
	}()

	<-stopSub
}

func extractHttpStatus(err errors.Error) int {
	httpStatus, aErr := strconv.Atoi(err.Error().Meta["http-status"])
	if aErr != nil {
		logrus.Error(aErr)
	}
	return httpStatus
}

func sendToWaitQueue(main *Main, msg payloads.MessageResponse) {
	msg.RetryCount += 1
	err := main.sendMessageWithExpiration(msg)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot publish message to wait queue", "Error to publish message").
				WithOperations("sendMessageWithExpiration"),
		}).Errorln()
		logrus.Error(err)
	}
}