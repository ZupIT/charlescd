package publisher

import (
	"errors"
	"fmt"
	"github.com/streadway/amqp"
	"hermes/internal/configuration"
)

func main() {
	fmt.Println("Go RabbitMQ Test")

	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		fmt.Println("Failed Initializing Broker Connection")
		panic(err)
	}
	defer conn.Close()

	fmt.Println("Successfully Connected to RabbitMQ")

	ch, err := conn.Channel()
	if err != nil {
		fmt.Println(err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"TestingQueue",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

	fmt.Println(q)

	err = ch.Publish(
		"",
		"TestingQueue",
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain", Body: []byte("Hello World"),
		},
	)

	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Published Message to Queue")
}

type MessageBody struct {
	Data []byte
	Type string
}

//Message is the amqp request to publish
type Message struct {
	Queue         string
	ReplyTo       string
	ContentType   string
	CorrelationID string
	Priority      uint8
	Body          MessageBody
}

type Connection struct {
	Name     string
	Conn     *amqp.Connection
	Channel  *amqp.Channel
	Exchange string
	Queues   string
	Err      chan error
}

func NewConnection(name, exchange string, queues string) *Connection {
	c := &Connection{
		Exchange: exchange,
		Queues:   queues,
		Err:      make(chan error),
	}

	return c
}

func (c *Connection) Connect() error {
	var err error
	c.Conn, err = amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return fmt.Errorf("Error in creating rabbitmq connection with %s : %s", configuration.GetConfiguration("ENCRYPTION_KEY"), err.Error())
	}
	go func() {
		<-c.Conn.NotifyClose(make(chan *amqp.Error)) //Listen to NotifyClose
		c.Err <- errors.New("Connection Closed")
	}()
	c.Channel, err = c.Conn.Channel()
	if err != nil {
		return fmt.Errorf("Channel: %s", err)
	}
	if err := c.Channel.ExchangeDeclare(
		c.Exchange, // name
		"direct",   // type
		true,       // durable
		false,      // auto-deleted
		false,      // internal
		false,      // noWait
		nil,        // arguments
	); err != nil {
		return fmt.Errorf("Error in Exchange Declare: %s", err)
	}
	return nil
}

func (c *Connection) BindQueue() error {
	if q, err := c.Channel.QueueDeclare(c.Queues, true, false, false, false, nil); err != nil {
		return fmt.Errorf("error in declaring the queue %s", err)
	} else {
		fmt.Println(q)

	}

	if err := c.Channel.QueueBind(c.Queues, c.Queues, c.Exchange, false, nil); err != nil {
		return fmt.Errorf("Queue  Bind error: %s", err)
	}
	return nil
}

//Reconnect reconnects the connection
func (c *Connection) Reconnect() error {
	if err := c.Connect(); err != nil {
		return err
	}
	if err := c.BindQueue(); err != nil {
		return err
	}
	return nil
}

func (c *Connection) Publish(m Message) error {
	select { //non blocking channel - if there is no error will go to default where we do nothing
	case err := <-c.Err:
		if err != nil {
			c.Reconnect()
		}
	default:
	}

	p := amqp.Publishing{
		//Headers:       amqp.Table{"type": m.Body.Type},
		ContentType:   m.ContentType,
		CorrelationId: m.CorrelationID,
		Body:          m.Body.Data,
		//ReplyTo:       m.ReplyTo,
	}
	if err := c.Channel.Publish(c.Exchange, m.Queue, false, false, p); err != nil {
		return fmt.Errorf("Error in Publishing: %s", err)
	}
	return nil
}
