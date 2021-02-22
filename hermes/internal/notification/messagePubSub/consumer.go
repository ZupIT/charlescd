package messagePubSub

import (
	"github.com/sirupsen/logrus"
	"hermes/internal/configuration"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"strconv"
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
				main.updateMessageInfo(msg, deliveredFailed, err.Error().Detail, extractHttpStatus(err))
			} else {
				main.updateMessageInfo(msg, delivered, successLog, 200)
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
						main.updateMessageInfo(msg, deliveredFailed, err.Error().Detail, extractHttpStatus(err))
					} else {
						main.updateMessageInfo(msg, delivered, successLog, 200)
					}
				}
			}()
		case <-stopSub:
			return
		}
	}
}

func extractHttpStatus(err errors.Error) int {
	httpStatus,aErr := strconv.Atoi(err.Error().Meta["http-status"])
	if aErr != nil {
		logrus.Error(aErr)
	}
	return httpStatus
}
