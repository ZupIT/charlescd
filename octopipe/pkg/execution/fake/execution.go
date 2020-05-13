package fake

import (
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExecutionManagerFake struct{}

func (executionManagr *ExecutionManagerFake) FindAll() (*[]execution.Execution, error) {
	panic("implement me")
}

func (executionManagr *ExecutionManagerFake) FindByID(id string) (*execution.Execution, error) {
	panic("implement me")
}

func NewExecutionFake() execution.ManagerUseCases {
	return &ExecutionManagerFake{}
}

func (executionManagr *ExecutionManagerFake) Create() (*primitive.ObjectID, error) {
	panic("implement me")
}

func (executionManagr *ExecutionManagerFake) CreateExecutionStep(
	executionID *primitive.ObjectID, step *pipeline.Step,
) (*primitive.ObjectID, error) {
	panic("implement me")
}

func (executionManagr *ExecutionManagerFake) ExecutionError(executionID *primitive.ObjectID, pipelineError error) error {
	panic("implement me")
}

func (executionManagr *ExecutionManagerFake) ExecutionFinished(executionID *primitive.ObjectID, pipelineError error) error {
	panic("implement me")
}

func (executionManagr *ExecutionManagerFake) UpdateExecutionStepStatus(executionID *primitive.ObjectID, stepID *primitive.ObjectID, status string) error {
	panic("implement me")
}
