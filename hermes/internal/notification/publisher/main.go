package publisher

import (
	"gorm.io/gorm"
	"hermes/internal/notification/message"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/queueprotocol"
)

type UseCases interface {
	Start(stopChan chan bool) error
}

type Main struct {
	db            *gorm.DB
	amqpClient    *queueprotocol.Client
	messageMain   message.UseCases
	executionMain messageexecutionhistory.UseCases
}

func NewMain(db *gorm.DB, amqpClient *queueprotocol.Client, messageMain message.UseCases, executionMain messageexecutionhistory.UseCases) UseCases {
	return &Main{db, amqpClient, messageMain, executionMain}
}
