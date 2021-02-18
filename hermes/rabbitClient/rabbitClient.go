package rabbitClient

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/sirupsen/logrus"
	"github.com/streadway/amqp"
	"hermes/internal/notification/payloads"
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
	messageQueue       string
	deliveredFailQueue string
	logger             *logrus.Logger
	connection         *amqp.Connection
	channel            *amqp.Channel
	done               chan os.Signal
	notifyClose        chan *amqp.Error
	notifyConfirm      chan amqp.Confirmation
	isConnected        bool
	alive              bool
	threads            int
	wg                 *sync.WaitGroup
}

func NewClient(messageQueue, deliveredFailQueue, addr string, l *logrus.Logger, done chan os.Signal) *Client {
	threads := runtime.GOMAXPROCS(0)
	if numCPU := runtime.NumCPU(); numCPU > threads {
		threads = numCPU
	}

	client := Client{
		logger:             l,
		threads:            threads,
		messageQueue:       messageQueue,
		deliveredFailQueue: deliveredFailQueue,
		done:               done,
		alive:              true,
		wg:                 &sync.WaitGroup{},
	}
	client.wg.Add(threads)

	go client.handleReconnect(addr)
	return &client
}

func (c *Client) handleReconnect(addr string) {
	for c.alive {
		c.isConnected = false
		t := time.Now()
		fmt.Printf("Attempting to connect to rabbitMQ: %s\n", addr)
		var retryCount int
		for !c.connect(addr) {
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

func (c *Client) connect(addr string) bool {
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
	ch.Confirm(false)

	_, err = ch.QueueDeclare(
		c.messageQueue,
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

	_, err = ch.QueueDeclare(
		c.deliveredFailQueue,
		true,  // Durable
		false, // Delete when unused
		false, // Exclusive
		false, // No-wait
		nil,   //Arguments
	)
	if err != nil {
		c.logger.Printf("failed to declare delivered fail queue: %v", err)
		return false
	}

	c.changeConnection(conn, ch)
	c.isConnected = true
	return true
}

func (c *Client) changeConnection(connection *amqp.Connection, channel *amqp.Channel) {
	c.connection = connection
	c.channel = channel
	c.channel.Confirm(false)
	c.notifyClose = make(chan *amqp.Error)
	c.notifyConfirm = make(chan amqp.Confirmation, 1)
	c.channel.NotifyClose(c.notifyClose)
	c.channel.NotifyPublish(c.notifyConfirm)
}

func (c *Client) Push(data []byte, queue string) error {
	if !c.isConnected {
		return errors.New("failed to push : not connected")
	}
	for {
		err := c.UnsafePush(data, queue)
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

func (c *Client) UnsafePush(data []byte, queue string) error {
	if !c.isConnected {
		return ErrDisconnected
	}
	return c.channel.Publish(
		"",
		queue,
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        data,
		},
	)
}

func (c *Client) Stream(response chan payloads.MessageResponse, queue string) {
	for {
		if c.isConnected {
			break
		}
		time.Sleep(1 * time.Second)
	}

	err := c.channel.Qos(1, 0, false)
	if err != nil {
		logrus.Error(err)
	}

	messages, err := c.channel.Consume(
		queue,
		time.Now().String(), // Consumer
		false,               // Auto-Ack
		false,               // Exclusive
		false,               // No-local
		false,               // No-Wait
		nil,                 // Args
	)
	if err != nil {
		logrus.Error(err)
	}

	go func() {
		for msg := range messages {
			messageResponse := c.processMessage(msg)
			response <- messageResponse
		}
	}()
}

func (c *Client) processMessage(msg amqp.Delivery) payloads.MessageResponse {
	l := c.logger
	startTime := time.Now()

	messageResponse, err := parseMessage(msg)
	if err != nil {
		logAndNack(msg, l, startTime, "error parse message: %s - %s", string(msg.Body), err.Error())
		return payloads.MessageResponse{}
	}

	defer func(messageResponse payloads.MessageResponse, m amqp.Delivery, logger *logrus.Logger) {
		if err := recover(); err != nil {
			stack := make([]byte, 8096)
			stack = stack[:runtime.Stack(stack, false)]
			l.WithFields(logrus.Fields{
				"stack": stack,
				"error": err,
			}).Fatal("panic recovery for rabbitMQ message")
			msg.Nack(false, false)
		}
	}(messageResponse, msg, l)

	logrus.WithFields(logrus.Fields{
		"Message consumed": messageResponse.Id,
		"Time":             time.Now(),
	}).Println()

	msg.Ack(false)
	return messageResponse
}

func logAndNack(msg amqp.Delivery, l *logrus.Logger, t time.Time, err string, args ...interface{}) {
	msg.Nack(false, false)
	l.WithFields(logrus.Fields{
		"took-ms": time.Since(t).Milliseconds(),
	}).Error(fmt.Sprintf(err, args...))
}

func parseMessage(msg amqp.Delivery) (payloads.MessageResponse, error) {
	var messageResponse payloads.MessageResponse
	err := json.Unmarshal(msg.Body, &messageResponse)
	return messageResponse, err
}
