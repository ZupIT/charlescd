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
	"context"
	"log"
	"octopipe/pkg/pipeline"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/bson"
)

const (
	ExecutionRunning  = "RUNNING"
	ExecutionFailed   = "FAILED"
	ExecutionFinished = "SUCCEEDED"
)

const (
	StepRunning  = "RUNNING"
	StepFailed   = "FAILED"
	StepRollout  = "ROLLOUT"
	StepFinished = "SUCCEEDED"
)

type Execution struct {
	ID         primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Status     string             `json:"status"`
	Steps      []*ExecutionStep   `json:"steps"`
	StartTime  time.Time          `json:"startTime"`
	FinishTime time.Time          `json:"finishTime"`
	Error      string             `json:"error"`
}

type ExecutionStep struct {
	ID primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	*pipeline.Step
	StartTime  time.Time `json:"startTime"`
	FinishTime time.Time `json:"finishTime"`
	Status     string    `json:"status"`
}

const (
	collection = "executions"
)

func (executionManager *ExecutionManager) FindAll() (*[]Execution, error) {
	executions := []Execution{}
	sort := map[string]int{"starttime": -1}
	opts := &options.FindOptions{
		Sort: sort,
	}
	cur, err := executionManager.DB.FindAll(context.TODO(), collection, map[string]string{}, opts)
	if err != nil {
		return nil, err
	}

	for cur.Next(context.TODO()) {
		var execution Execution
		err := cur.Decode(&execution)

		if err != nil {
			return nil, err
		}

		executions = append(executions, execution)
	}

	return &executions, nil

}

func (executionManager *ExecutionManager) FindByID(id string) (*Execution, error) {
	execution := Execution{}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": objectID}
	err = executionManager.DB.FindOne(context.TODO(), collection, filter).Decode(&execution)
	if err != nil {
		return nil, err
	}

	return &execution, nil
}

func (executionManager *ExecutionManager) Create() (*primitive.ObjectID, error) {
	newExecution := &Execution{
		Status:    ExecutionRunning,
		Steps:     []*ExecutionStep{},
		StartTime: time.Now(),
	}

	newExecution.ID = primitive.NewObjectID()
	result, err := executionManager.DB.Create(context.TODO(), collection, newExecution)
	if err != nil {
		log.Println("ERROR", err)
		return nil, err
	}

	objID := result.InsertedID.(primitive.ObjectID)
	return &objID, nil
}

func (executionManager *ExecutionManager) CreateExecutionStep(
	executionID *primitive.ObjectID, step *pipeline.Step,
) (*primitive.ObjectID, error) {
	newID := primitive.NewObjectID()
	newExecutionStep := &ExecutionStep{
		ID:        newID,
		Step:      step,
		Status:    StepRunning,
		StartTime: time.Now(),
	}

	query := bson.M{"_id": executionID}
	updateData := bson.M{
		"$push": bson.M{
			"steps": newExecutionStep,
		},
	}
	_, err := executionManager.DB.UpdateOne(context.TODO(), collection, query, updateData)
	if err != nil {
		return nil, err
	}

	return &newID, nil
}

func (executionManager *ExecutionManager) ExecutionError(executionID *primitive.ObjectID, pipelineError error) error {
	query := bson.M{"_id": executionID}
	updateData := bson.M{
		"$set": bson.M{
			"status":     ExecutionFailed,
			"error":      pipelineError.Error(),
			"finishTime": time.Now(),
		},
	}

	_, err := executionManager.DB.UpdateOne(context.TODO(), collection, query, updateData)
	if err != nil {
		return err
	}

	return nil
}

func (executionManager *ExecutionManager) ExecutionFinished(executionID *primitive.ObjectID, pipelineError chan error) error {
	var status string
	var pipelineErrorMessage string
	if pipelineError != nil {
		status = ExecutionFailed
		errorObject := <- pipelineError
		pipelineErrorMessage = errorObject.Error()
	} else {
		status = ExecutionFinished

	}
	query := bson.M{"_id": executionID}
	updateData := bson.M{
		"$set": bson.M{
			"status":     status,
			"finishtime": time.Now(),
			"error":      pipelineErrorMessage,
		},
	}

	_, err := executionManager.DB.UpdateOne(context.TODO(), collection, query, updateData)
	if err != nil {
		return err
	}

	return nil
}

func (executionManager *ExecutionManager) UpdateExecutionStepStatus(executionID *primitive.ObjectID, stepID *primitive.ObjectID, status string) error {
	query := bson.M{
		"_id":       executionID,
		"steps._id": stepID,
	}
	updateData := bson.M{
		"$set": bson.M{
			"steps.$.status":     status,
			"steps.$.finishtime": time.Now(),
		},
	}

	_, err := executionManager.DB.UpdateOne(context.TODO(), collection, query, updateData)
	if err != nil {
		return err
	}

	return nil
}
