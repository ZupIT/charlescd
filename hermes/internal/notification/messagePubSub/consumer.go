package messagePubSub

import (
	"github.com/sirupsen/logrus"
	"hermes/internal/configuration"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"time"
)

func (main *Main) Consume(stopSub chan bool) {
	response := make(chan payloads.MessageResponse, 0)

	func() {
		for {
			go main.amqpClient.Stream(response, configuration.GetConfiguration("AMQP_MESSAGE_QUEUE"))
			msg := <-response
			err := main.subscriptionMain.SendWebhookEvent(msg)
			if err != nil {
				logrus.Error(err)
				main.updateMessageStatus(msg, deliveredFailed, err.Error().Detail)
			} else {
				main.updateMessageStatus(msg, delivered, successLog)
			}
		}
	}()

	<-stopSub
}

func (main *Main) ConsumeDeliveredFail(stopSub chan bool) {
	interval, err := time.ParseDuration(configuration.GetConfiguration("PUBLISHER_TIME"))
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": errors.NewError("Cannot start publish", "Get sync interval failed").
				WithOperations("Start.getInterval"),
		}).Errorln()
		logrus.Error(err)
	}

	ticker := time.NewTicker(interval)
	for {
		select {
		case <-ticker.C:
			response := make(chan payloads.MessageResponse, 0)
			func() {
				for {
					go main.amqpClient.Stream(response, configuration.GetConfiguration("AMQP_DELIVERED_FAIL_QUEUE"))
					msg := <-response
					err := main.subscriptionMain.SendWebhookEvent(msg)
					if err != nil {
						logrus.Error(err)
						main.updateMessageStatus(msg, deliveredFailed, err.Error().Detail)
					} else {
						main.updateMessageStatus(msg, delivered, successLog)
					}
				}
			}()
		case <-stopSub:
			return
		}
	}
}
