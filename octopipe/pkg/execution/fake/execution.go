/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

func (executionManagr *ExecutionManagerFake) ExecutionFinished(executionID *primitive.ObjectID, pipelineError chan error) error {
	panic("implement me")
}

func (executionManagr *ExecutionManagerFake) UpdateExecutionStepStatus(executionID *primitive.ObjectID, stepID *primitive.ObjectID, status string) error {
	panic("implement me")
}
