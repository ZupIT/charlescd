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
	ExecutionFinished(executionID *primitive.ObjectID, ṕipelineError chan error ) error
	UpdateExecutionStepStatus(executionID *primitive.ObjectID, stepID *primitive.ObjectID, status string) error
}

type ExecutionManager struct {
	DB database.UseCases
}

func NewExecutionManager(db database.UseCases) ManagerUseCases {
	return &ExecutionManager{db}
}
