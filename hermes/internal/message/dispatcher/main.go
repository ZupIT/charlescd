package dispatcher

import (
	"gorm.io/gorm"
	"hermes/internal/message/message"
	"hermes/internal/message/messageexecutionhistory"
	"hermes/queueprotocol"
	"sync"
)

type UseCases interface {
	Start(stopChan chan bool) error
}

type Main struct {
	db            *gorm.DB
	amqpClient    *queueprotocol.Client
	messageMain   message.UseCases
	executionMain messageexecutionhistory.UseCases
	mux           sync.Mutex
}

func NewMain(db *gorm.DB, amqpClient *queueprotocol.Client, messageMain message.UseCases, executionMain messageexecutionhistory.UseCases) UseCases {
	return &Main{db, amqpClient, messageMain, executionMain, sync.Mutex{}}
}
