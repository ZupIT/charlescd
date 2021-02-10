package rabbitClient

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"hermes/internal/configuration"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"time"
)

func (main *Main) Publish(stopChan chan bool) error {
	interval, err := time.ParseDuration(configuration.GetConfiguration("PUBLISHER_TIME"))
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start publish", "Get sync interval failed").
				WithOperations("Start.getInterval"),
		}).Errorln()
		return err
	}

	ticker := time.NewTicker(interval)
	for {
		select {
		case <-ticker.C:
			main.publish()
		case <-stopChan:
			return nil
		}
	}

}

func (main *Main) publish() {
	messages, err := main.messageMain.FindAllNotEnqueued()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start publish", "Could not find active messages").
				WithOperations("publish.FindAllNotEnqueued"),
		}).Errorln()
	}

	logrus.WithFields(logrus.Fields{
		"Messages ready to publish": len(messages),
		"Time": time.Now(),
	}).Println()

	for _, msg := range messages {
		 main.sendMessage(msg)
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

func (main *Main) updateMessageStatus(message payloads.MessageResponse, status, log string) {
	data := messageexecutionhistory.MessagesExecutionsHistory{
		ID:           uuid.New(),
		ExecutionId:  message.Id,
		ExecutionLog: log,
		Status:       status,
		LoggedAt:     time.Now(),
	}

	main.db.Transaction(func(tx *gorm.DB) error {
		retryExec := tx.Table("messages_executions_histories").Create(&data)
		if retryExec.Error != nil {
			logrus.WithFields(logrus.Fields{
				"err": errors.NewError("Push message error", "Could not save not enqueued execution").
					WithOperations("sendMessage.Push.RetryExec"),
			}).Errorln()

			return retryExec.Error
		}

		retryMsg := tx.Table("messages").Where("id = ?", message.Id).Update("last_status", status)
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

func (main *Main) Consume(stopChan chan bool) {
	go func() {
		for {
			err := main.amqpClient.Stream(stopChan)
			if err != nil {
				continue
			}
			break
		}
	}()
}
