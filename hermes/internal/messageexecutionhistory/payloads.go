package messageexecutionhistory

import (
	"github.com/google/uuid"
	"time"
)

type Request struct {
	ExecutionId  uuid.UUID `json:"executionId"`
	ExecutionLog string    `json:"executionLog"`
	Status       string    `json:"status"`
	LoggedAt     time.Time `json:"-"`
}

type Response struct {
	Id uuid.UUID `json:"id"`
}
