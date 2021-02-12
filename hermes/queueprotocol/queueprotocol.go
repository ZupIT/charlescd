package queueprotocol

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
	pushQueue     string
	streamQueue   string
	logger        *logrus.Logger
	connection    *amqp.Connection
	channel       *amqp.Channel
	done          chan os.Signal
	notifyClose   chan *amqp.Error
	notifyConfirm chan amqp.Confirmation
	isConnected   bool
	alive         bool
	threads       int
	wg            *sync.WaitGroup
}

func NewClient(streamQueue, pushQueue, addr string, l *logrus.Logger, done chan os.Signal) *Client {
	threads := runtime.GOMAXPROCS(0)
	if numCPU := runtime.NumCPU(); numCPU > threads {
		threads = numCPU
	}

	client := Client{
		logger:      l,
		threads:     threads,
		pushQueue:   pushQueue,
		streamQueue: streamQueue,
		done:        done,
		alive:       true,
		wg:          &sync.WaitGroup{},
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
		c.streamQueue,
		true,  // Durable
		false, // Delete when unused
		false, // Exclusive
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		c.logger.Printf("failed to declare listen queue: %v", err)
		return false
	}

	_, err = ch.QueueDeclare(
		c.pushQueue,
		true,  // Durable
		false, // Delete when unused
		false, // Exclusive
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		c.logger.Printf("failed to declare push queue: %v", err)
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

func (c *Client) UnsafePush(data []byte) error {
	if !c.isConnected {
		return ErrDisconnected
	}
	return c.channel.Publish(
		"",
		c.pushQueue,
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        data,
		},
	)
}

func (c *Client) Stream() error {
	for {
		if c.isConnected {
			break
		}
		time.Sleep(1 * time.Second)
	}

	err := c.channel.Qos(1, 0, false)
	if err != nil {
		return err
	}

	for i := 1; i <= c.threads; i++ {
		messages, err := c.channel.Consume(
			c.streamQueue,
			consumerName(i), 		// Consumer
			false,           // Auto-Ack
			false,           // Exclusive
			false,           // No-local
			false,           // No-Wait
			nil,             // Args
		)
		if err != nil {
			return err
		}

		go func(i int) {
			defer c.wg.Done()
			for msg := range messages {
				c.processMessage(msg, consumerName(i))
			}
		}(i)
	}

	c.wg.Wait()

	return nil
}

func (c *Client) processMessage(msg amqp.Delivery, consumerName string) {
	l := c.logger
	startTime := time.Now()

	messageResponse, err := parseMessage(msg)
	if err != nil {
		logAndNack(msg, l, startTime, "unmarshalling body: %s - %s", string(msg.Body), err.Error())
		return
	}

	if messageResponse.Id.String() == "" {
		logAndNack(msg, l, startTime, "received event without id")
		return
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
		"Consumer":         consumerName,
		"Message consumed": messageResponse.Id,
		"Time":             time.Now(),
	}).Println()

	msg.Ack(false)
}

func logAndNack(msg amqp.Delivery, l *logrus.Logger, t time.Time, err string, args ...interface{}) {
	msg.Nack(false, false)
	l.WithFields(logrus.Fields{
		"took-ms": time.Since(t).Milliseconds(),
	}).Error(fmt.Sprintf(err, args...))
}

func consumerName(i int) string {
	return fmt.Sprintf("hermes-consumer-%d", i)
}

func parseMessage(msg amqp.Delivery) (payloads.MessageResponse, error) {
	var messageResponse payloads.MessageResponse
	err := json.Unmarshal(msg.Body, &messageResponse)

	return messageResponse, err
}
