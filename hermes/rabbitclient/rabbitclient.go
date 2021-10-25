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

package rabbitclient

import (
	"errors"
	"fmt"
	"github.com/sirupsen/logrus"
	"github.com/streadway/amqp"
	"hermes/internal/notification/payloads"
	"log"
	"os"
	"runtime"
	"sync"
	"time"
)

var (
	ErrDisconnected = errors.New("disconnected from rabbitmq, trying to reconnect")
)

const (
	reconnectDelay = 5 * time.Second
)

type Client struct {
	messageQueue         string
	waitQueue            string
	exchangeMessageQueue string
	exchangeWaitQueue    string
	messageRoutingKey    string
	retryExpiration      string
	logger               *logrus.Logger
	connection           *amqp.Connection
	channel              *amqp.Channel
	done                 chan os.Signal
	notifyClose          chan *amqp.Error
	notifyConfirm        chan amqp.Confirmation
	isConnected          bool
	alive                bool
	threads              int
	wg                   *sync.WaitGroup
}

func NewClient(messageQueue, waitQueue, exchangeMessageQueue, exchangeWaitQueue, messageRoutingKey, retryExpiration, addr string, l *logrus.Logger, done chan os.Signal) *Client {
	threads := runtime.GOMAXPROCS(0)
	if numCPU := runtime.NumCPU(); numCPU > threads {
		threads = numCPU
	}

	client := Client{
		logger:               l,
		threads:              threads,
		messageQueue:         messageQueue,
		waitQueue:            waitQueue,
		exchangeMessageQueue: exchangeMessageQueue,
		exchangeWaitQueue:    exchangeWaitQueue,
		messageRoutingKey:    messageRoutingKey,
		retryExpiration:      retryExpiration,
		done:                 done,
		alive:                true,
		wg:                   &sync.WaitGroup{},
	}
	client.wg.Add(threads)

	go client.handleReconnect(addr, messageQueue, waitQueue, exchangeMessageQueue, exchangeWaitQueue, messageRoutingKey)
	return &client
}

func (c *Client) handleReconnect(addr string, messageQueue string, waitQueue string, exchangeMessageQueue string, exchangeWaitQueue string, messageRoutingKey string) {
	for c.alive {
		c.isConnected = false
		t := time.Now()
		logrus.Infof("Attempting to connect to rabbitMQ: %s\n", addr)
		var retryCount int
		for !c.connect(addr, messageQueue, waitQueue, exchangeMessageQueue, exchangeWaitQueue, messageRoutingKey) {
			if !c.alive {
				return
			}
			select {
			case <-c.done:
				return
			case <-time.After(reconnectDelay + time.Duration(retryCount)*time.Second):
				c.logger.Printf("disconnected from rabbitMQ and failed to connect")
				retryCount++
			}
		}
		c.logger.Printf("Connected to rabbitMQ in: %vms", time.Since(t).Milliseconds())
		select {
		case <-c.done:
			return
		case <-c.notifyClose:
		}
	}
}

func (c *Client) connect(addr string, messageQueue string, waitQueue string, exchangeMessageQueue string, exchangeWaitQueue string, messageRoutingKey string) bool {

	conn, err := amqp.Dial(addr)
	if err != nil {
		c.logger.Printf("failed to dial rabbitMQ server: %v", err)
		return false
	}
	ch, err := conn.Channel()
	if err != nil {
		c.logger.Printf("failed connecting to channel: %v", err)
		return false
	}
	err = ch.Confirm(false)
	if err != nil {
		c.logger.Printf("Error to put channel in confirm mode: %v", err)
		return false
	}
	err = ch.ExchangeDeclare(
		exchangeMessageQueue,
		"topic",
		true,
		false,
		false,
		false,
		nil)

	if err != nil {
		c.logger.Printf("failed to declare exchange queue: %v", err)
		return false
	}

	_, err = ch.QueueDeclare(
		messageQueue,
		true,  // Durable
		false, // Delete when unused
		false, // Exclusive
		false, // No-wait
		nil,   //Arguments
	)
	if err != nil {
		c.logger.Printf("failed to declare message queue: %v", err)
		return false
	}

	err = ch.QueueBind(messageQueue, messageRoutingKey, exchangeMessageQueue, false, nil)
	if err != nil {
		log.Printf("Erro ao fazer binding da fila " + c.messageQueue + " com " + "exchange-message")
	}

	err = ch.ExchangeDeclare(
		exchangeWaitQueue,
		"topic",
		true,
		false,
		false,
		false,
		nil)

	if err != nil {
		c.logger.Printf("failed to declare exchange queue: %v", err)
		return false
	}

	args := make(amqp.Table)
	args["x-dead-letter-exchange"] = exchangeMessageQueue
	_, err = ch.QueueDeclare(waitQueue, true, false, false, false, args)

	if err != nil {
		c.logger.Printf("failed to declare message queue: %v", err)
		return false
	}

	err = ch.QueueBind(waitQueue, messageRoutingKey, exchangeWaitQueue, false, nil)
	if err != nil {
		log.Printf("Erro ao fazer binding da fila " + c.messageQueue + " com " + "exchange-message")
	}

	c.changeConnection(conn, ch)
	c.isConnected = true
	return true
}

func (c *Client) changeConnection(connection *amqp.Connection, channel *amqp.Channel) {
	c.connection = connection
	c.channel = channel
	err := c.channel.Confirm(false)
	if err != nil {
		c.logger.WithFields(logrus.Fields{
			"err": fmt.Errorf("cannot confirm channel %s", err.Error()),
		})
	}
	c.notifyClose = make(chan *amqp.Error)
	c.notifyConfirm = make(chan amqp.Confirmation, 1)
	c.channel.NotifyClose(c.notifyClose)
	c.channel.NotifyPublish(c.notifyConfirm)
}

func (c *Client) Push(data []byte) error {
	if !c.isConnected {
		return errors.New("failed to push : not connected")
	}
	for {
		err := c.UnsafePush(data)
		if err != nil {
			if err == ErrDisconnected {
				continue
			}
			return err
		}
		select {
		case confirm := <-c.notifyConfirm:
			if confirm.Ack {
				return nil
			}
			return errors.New("no push confirmation received")
		case <-time.After(reconnectDelay):
			return errors.New("no push confirmation received")
		}
	}

}

func (c *Client) PushWithExpiration(data []byte) error {

	if !c.isConnected {
		return errors.New("failed to push : not connected")
	}
	for {
		err := c.UnsafePushWithExpiration(data)
		if err != nil {
			if err == ErrDisconnected {
				continue
			}
			return err
		}
		select {
		case confirm := <-c.notifyConfirm:
			if confirm.Ack {
				return nil
			}
			return errors.New("no push confirmation received")
		case <-time.After(reconnectDelay):
			return errors.New("no push confirmation received")
		}
	}

}

func (c *Client) UnsafePush(data []byte) error {
	exchangeMessage := "exchange-message"
	routingKeyMessage := "routing-key-message"

	if !c.isConnected {
		return ErrDisconnected
	}
	return c.channel.Publish(
		exchangeMessage,
		routingKeyMessage,
		false,
		false,
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "text/plain",
			Body:         data,
		},
	)
}

func (c *Client) UnsafePushWithExpiration(data []byte) error {

	if !c.isConnected {
		return ErrDisconnected
	}
	return c.channel.Publish(
		c.exchangeWaitQueue,
		c.messageRoutingKey,
		false,
		false,
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "text/plain",
			Body:         data,
			Expiration:   "30000",
		},
	)
}

func (c *Client) Stream() (<-chan amqp.Delivery, error) {
	for {
		if c.isConnected {
			break
		}
		time.Sleep(1 * time.Second)
	}

	return c.channel.Consume(
		c.messageQueue,
		"hermes-consumer",
		false,
		false,
		false,
		false,
		nil,
	)
}

func (c *Client) LogAndAck(msg amqp.Delivery, response payloads.MessageResponse) {
	ackErr := msg.Ack(false)
	if ackErr != nil {
		c.logger.WithFields(logrus.Fields{
			"err": fmt.Errorf("cannot acknowledge message %s", ackErr.Error()),
		})
	}
	c.logger.WithFields(logrus.Fields{
		"Message consumed": response.ID,
		"Time":             time.Now(),
	}).Info()
}

func (c *Client) LogAndNack(msg amqp.Delivery, t time.Time, err string, args ...interface{}) {
	nackErr := msg.Nack(false, false)
	if nackErr != nil {
		c.logger.WithFields(logrus.Fields{
			"err": fmt.Errorf("cannot nack message %s", nackErr.Error()),
		})
	}
	c.logger.WithFields(logrus.Fields{
		"took-ms": time.Since(t).Milliseconds(),
	}).Error(fmt.Sprintf(err, args...))
}
