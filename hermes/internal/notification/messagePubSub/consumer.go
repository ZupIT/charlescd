package messagePubSub

import (
	"github.com/sirupsen/logrus"
	"hermes/internal/notification/payloads"
)

func (main *Main) Consume(stopSub chan bool) {
	response := make(chan payloads.MessageResponse, 0)

	func() {
		for {
			go main.amqpClient.Stream(response)
			msg := <-response
			err := main.subscriptionMain.SendWebhookEvent(msg)
			if err != nil {
				logrus.Error(err.Error())
			}
		}
	}()

	<-stopSub
}
