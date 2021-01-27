package dispatcher

import (
	"encoding/json"
	"github.com/sirupsen/logrus"
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

	for _, msg := range messages {
		go main.sendMessage(msg)
	}
}

func (main *Main) sendMessage(message payloads.MessageResponse) {
	pushMsg, err := json.Marshal(message)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("ParseMessageError", "Could not parse message").
				WithOperations("sendMessage.Marshal"),
		}).Errorln()
	}

	err = main.amqpClient.Push(pushMsg)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("ParseMessageError", "Could not parse message").
				WithOperations("sendMessage.Marshal"),
		}).Errorln()
	}
}