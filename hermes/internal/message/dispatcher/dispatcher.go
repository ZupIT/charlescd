package dispatcher

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"hermes/internal/message/messageexecutionhistory"
	"hermes/internal/message/payloads"
	"hermes/pkg/errors"
	"time"
)

const (
	enqueued    = "ENQUEUED"
	notEnqueued = "NOT_ENQUEUED"
)

func (main *Main) Start(stopChan chan bool) error {
	interval, err := time.ParseDuration("15s")
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start dispatch", "Get sync interval failed").
				WithOperations("Start.getInterval"),
		}).Errorln()
		return err
	}

	ticker := time.NewTicker(interval)
	for {
		select {
		case <-ticker.C:
			main.dispatch()
		case <-stopChan:
			return nil
		}
	}

}

func (main *Main) dispatch() {
	messages, err := main.messageMain.FindAllNotEnqueued()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start dispatch", "Could not find active messages").
				WithOperations("dispatch.FindAllNotEnqueued"),
		}).Errorln()
	}

	fmt.Println("dispatch")

	for _, msg := range messages {
		go main.sendMessage(msg)
	}
}

func (main *Main) sendMessage(message payloads.MessageResponse) error {
	defer main.mux.Unlock()
	main.mux.Lock()

	fmt.Println("sendMessage")
	pushMsg, err := json.Marshal(message)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("ParseMessageError", "Could not parse message").
				WithOperations("sendMessage.Marshal"),
		}).Errorln()
	}

	err = main.amqpClient.Push(pushMsg)
	if err != nil {
		main.updateMessageStatus(message, notEnqueued)
		return err
	}

	main.updateMessageStatus(message, enqueued)

	return nil
}

func (main *Main) updateMessageStatus(message payloads.MessageResponse, status string) {
	data := messageexecutionhistory.MessagesExecutionsHistory{
		ID:           uuid.New(),
		ExecutionId:  message.Id,
		ExecutionLog: "",
		Status:       status,
		LoggedAt:     time.Now(),
	}

	retryExec := main.db.Table("messages_executions_histories").Create(&data)
	if retryExec.Error != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Push message error", "Could not save not enqueued execution").
				WithOperations("sendMessage.Push.RetryExec"),
		}).Errorln()
	}

	retryMsg := main.db.Table("messages").Where("id = ?", message.Id).Update("last_status", status)
	if retryMsg.Error != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Push message error", "Could not update not enqueued message").
				WithOperations("sendMessage.Push.RetryMsg"),
		}).Errorln()
	}
}
