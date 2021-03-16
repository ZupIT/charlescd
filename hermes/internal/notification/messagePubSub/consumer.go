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
	"fmt"
	"github.com/sirupsen/logrus"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"strconv"
	"time"
)

func (main *Main) Consume(queue string) {
	response := make(chan payloads.MessageResponse, 0)
	fmt.Printf("\n[COnsumer] Queue: %s Time: %s\n", queue, time.Now())
	func() {
		go main.amqpClient.Stream(response, queue)
		msg := <-response
		err := main.subscriptionMain.SendWebhookEvent(msg)
		if err != nil {
			logrus.Error(err.Error())
			main.updateMessageInfo(msg, deliveredFailed, err.Error().Detail, extractHttpStatus(err))
		} else {
			main.updateMessageInfo(msg, delivered, successLog, 200)
		}
	}()
}

func extractHttpStatus(err errors.Error) int {
	httpStatus, aErr := strconv.Atoi(err.Error().Meta["http-status"])
	if aErr != nil {
		logrus.Error(aErr)
	}
	return httpStatus
}
