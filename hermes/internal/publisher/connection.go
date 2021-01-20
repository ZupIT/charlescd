package publisher

import (
	"fmt"
	"github.com/streadway/amqp"
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



