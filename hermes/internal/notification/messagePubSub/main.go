package messagePubSub

import (
	"gorm.io/gorm"
	"hermes/internal/notification/message"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/subscription"
	"hermes/rabbitClient"
)

const (
	enqueued        = "ENQUEUED"
	notEnqueued     = "NOT_ENQUEUED"
	delivered       = "DELIVERED"
	deliveredFailed = "DELIVERED_FAILED"
	successLog      = "SUCCESS"
)

type UseCases interface {
	Publish(stopPub chan bool) error
	Consume(stopSub chan bool)
}

type Main struct {
	db               *gorm.DB
	amqpClient       *rabbitClient.Client
	messageMain      message.UseCases
	executionMain    messageexecutionhistory.UseCases
	subscriptionMain subscription.UseCases
}

func NewMain(
	db *gorm.DB,
	amqpClient *rabbitClient.Client,
	messageMain message.UseCases,
	executionMain messageexecutionhistory.UseCases,
	subscriptionMain subscription.UseCases) UseCases {
	return &Main{db, amqpClient, messageMain, executionMain, subscriptionMain}
}
