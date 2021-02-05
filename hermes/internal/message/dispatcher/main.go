package dispatcher

import (
	"gorm.io/gorm"
	"hermes/internal/message/message"
	"hermes/internal/message/messageexecutionhistory"
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
