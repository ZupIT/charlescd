package messageexecutionhistory

import (
	"github.com/google/uuid"
	"hermes/pkg/errors"
	"time"
)

type MessagesExecutionHistory struct {
	ID           uuid.UUID `json:"id"`
	ExecutionId  uuid.UUID `json:"executionId"`
	ExecutionLog string    `json:"executionLog"`
	Status       string    `json:"status"`
	LoggedAt     time.Time `json:"-"`
}

func (main Main) Save(execution Request) (Response, errors.Error) {
	id := uuid.New()
	message := MessagesExecutionHistory{
		ID:           id,
		ExecutionId:  execution.ExecutionId,
		ExecutionLog: execution.ExecutionLog,
		Status:       execution.Status,
		LoggedAt:     time.Now(),
	}

	result := main.db.Model(&MessagesExecutionHistory{}).Create(&message)
	if result.Error != nil {
		return Response{}, errors.NewError("Save Subscription Execution error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return Response{message.ID}, nil
}