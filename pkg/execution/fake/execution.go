package fake

import (
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExecutionManagerFake struct{}

func NewExecutionFake() *ExecutionManagerFake {
	return &ExecutionManagerFake{}
}

func (executionManagr *ExecutionManagerFake) FindAll() (*[]execution.Execution, error) {
	return nil, nil
}

func (executionManagr *ExecutionManagerFake) FindByID(id string) (*execution.Execution, error) {
	return nil, nil
}

func (executionManagr *ExecutionManagerFake) Create(pipeline *pipeline.Pipeline) (*primitive.ObjectID, error) {
	return nil, nil
}

func (executionManagr *ExecutionManagerFake) CreateVersion(
	executionID *primitive.ObjectID, version *pipeline.Version,
) (*primitive.ObjectID, error) {
	return nil, nil
}

func (executionManagr *ExecutionManagerFake) CreateVersionManifest(
	executionID *primitive.ObjectID, versionID *primitive.ObjectID, name string, manifest interface{},
) (*primitive.ObjectID, error) {
	return nil, nil
}

func (executionManagr *ExecutionManagerFake) CreateIstioComponent(
	executionID *primitive.ObjectID, name string, manifest interface{},
) (*primitive.ObjectID, error) {
	return nil, nil
}

func (executionManagr *ExecutionManagerFake) CreateUnusedVersion(executionID *primitive.ObjectID, name string) {
	return
}

func (executionManagr *ExecutionManagerFake) UpdateExecutionStatus(executionID *primitive.ObjectID, status string) {
	return
}

func (executionManagr *ExecutionManagerFake) UpdateManifestStatus(
	executionID *primitive.ObjectID, versionID *primitive.ObjectID, manifestID *primitive.ObjectID, status string,
) {
	return
}

func (executionManagr *ExecutionManagerFake) FinishExecution(executionID *primitive.ObjectID, status string) {
	return
}
