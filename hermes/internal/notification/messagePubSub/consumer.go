package messagePubSub

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"hermes/internal/notification/payloads"
)

func (main *Main) Consume(stopSub chan bool) {
	fmt.Println("[Consumer] - waiting messages...")

	response := make(chan payloads.MessageResponse, 0)

	go func() {
		for {
			go main.amqpClient.Stream(response)
			msg := <-response
			err := main.subscriptionMain.SendWebhookEvent(msg)
			if err != nil {
				logrus.Error(err)
			}
		}
	}()

	<-stopSub
}
