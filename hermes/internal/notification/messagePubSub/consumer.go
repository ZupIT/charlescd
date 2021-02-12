package messagePubSub

import (
	"fmt"
	"github.com/sirupsen/logrus"
)

func (main *Main) Consume(stopSub chan bool) {
	fmt.Println("[Consumer] - waiting messages...")

	go func() {
		for {
			msg, err := main.amqpClient.Stream()
			if err != nil {
				logrus.Error(err)
			}
			main.subscriptionMain.SendWebhookEvent(msg)
		}
	}()

	<-stopSub
}
