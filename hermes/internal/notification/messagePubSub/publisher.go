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
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"time"
)

func (main *Main) Publish() {
	logrus.Info("[Publisher] Time: " + time.Now().String())

	messages, err := main.messageMain.FindAllNotEnqueued()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start publisher", "Could not find active messages").
				WithOperations("publish.FindAllNotEnqueuedAndDeliveredFail"),
		}).Errorln()
	}

	for i, msg := range messages {
		logrus.WithFields(logrus.Fields{
			"Messages ready to publish": len(messages) - i,
			"Time":                      time.Now(),
		}).Println()

		err := main.sendMessage(msg)
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"err": errors.NewError("Cannot publish message", "Error to publish message").
					WithOperations("sendMessage"),
			}).Errorln()
			logrus.Error(err)
		}
	}
}

func (main *Main) sendMessage(message payloads.MessageResponse) error {
	pushMsg, err := json.Marshal(message)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("ParseMessageError", "Could not parse message").
				WithOperations("sendMessage.Marshal"),
		}).Errorln()
	}

	err = main.amqpClient.Push(pushMsg)
	if err != nil {
		main.updateMessageStatus(message, notEnqueued, err.Error())
		return err
	}
	main.updateMessageStatus(message, enqueued, successLog)
	return nil
}

func (main *Main) sendMessageWithExpiration(message payloads.MessageResponse) error {
	pushMsg, err := json.Marshal(message)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("ParseMessageError", "Could not parse message").
				WithOperations("sendMessage.Marshal"),
		}).Errorln()
	}

	err = main.amqpClient.PushWithExpiration(pushMsg)
	if err != nil {
		main.updateMessageStatus(message, notEnqueued, err.Error())
		return err
	}

	main.updateMessageStatus(message, enqueued, successLog)
	return nil
}

func (main *Main) updateMessageInfo(message payloads.MessageResponse, status, log string, httpStatus int) error {
	data := messageexecutionhistory.MessagesExecutionsHistory{
		ID:           uuid.New(),
		ExecutionID:  message.ID,
		ExecutionLog: log,
		Status:       status,
		HTTPStatus:   httpStatus,
		LoggedAt:     time.Now(),
	}

	return main.db.Transaction(func(tx *gorm.DB) error {
		retryExec := tx.Table("messages_executions_histories").Create(&data)
		if retryExec.Error != nil {
			logrus.WithFields(logrus.Fields{
				"err": errors.NewError("Push message error", "Could not save not enqueued execution").
					WithOperations("sendMessage.Push.RetryExec"),
			}).Errorln()

			return retryExec.Error
		}

		retryMsg := tx.Table("messages").Where("id = ?", message.ID).Update("last_status", status)
		if retryMsg.Error != nil {
			logrus.WithFields(logrus.Fields{
				"err": errors.NewError("Push message error", "Could not update not enqueued message").
					WithOperations("sendMessage.Push.RetryMsg"),
			}).Errorln()

			return retryMsg.Error
		}

		return nil
	})
}

func (main *Main) updateMessageStatus(message payloads.MessageResponse, status, log string) {
	updateMessageErr := main.updateMessageInfo(message, status, log, 0)
	if updateMessageErr != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot update message", updateMessageErr.Error()).
				WithOperations("SendWebhookEvent"),
		}).Errorln(updateMessageErr)
	}
}
