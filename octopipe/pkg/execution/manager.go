package execution

import (
	"octopipe/pkg/database"
	"octopipe/pkg/pipeline"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ManagerUseCases interface {
	FindAll() (*[]Execution, error)
	FindByID(id string) (*Execution, error)
	Create() (*primitive.ObjectID, error)
	CreateExecutionStep(
		executionID *primitive.ObjectID, step *pipeline.Step,
	) (*primitive.ObjectID, error)
	ExecutionError(executionID *primitive.ObjectID, pipelineError error) error
	ExecutionFinished(executionID *primitive.ObjectID, pipelineError error) error
	UpdateExecutionStepStatus(executionID *primitive.ObjectID, stepID *primitive.ObjectID, status string) error
}

type ExecutionManager struct {
	DB database.UseCases
}

func NewExecutionManager(db database.UseCases) ManagerUseCases {
	return &ExecutionManager{db}
}
