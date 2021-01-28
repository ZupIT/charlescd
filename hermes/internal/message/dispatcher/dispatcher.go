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

func (main *Main) sendMessage(message payloads.MessageResponse) {
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
		data := messageexecutionhistory.MessagesExecutionsHistory{
			ID:           uuid.New(),
			ExecutionId:  message.Id,
			ExecutionLog: "",
			Status:       "ENQUEUD_FAILED",
			LoggedAt:     time.Now(),
		}

		retry := main.db.Table("messages_executions_histories").Create(&data)
		if retry.Error != nil {
			logrus.WithFields(logrus.Fields{
				"err": errors.NewError("Push message error", "Could not save message execution").
					WithOperations("sendMessage.Push.Retry"),
			}).Errorln()
		}
	}

}
