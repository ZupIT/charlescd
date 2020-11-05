/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package main

import (
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
)

type executionConfiguration struct {
	DestinationCircleID string `json:"destinationCircleId"`
	OriginCircleID      string `json:"originCircleId"`
	WorkspaceID         string `json:"workspaceId"`
}

type actionConfiguration struct {
	MooveURL string `json:"mooveUrl"`
}

func Do(actionConfig []byte, executionConfig []byte) error {
	var ac *actionConfiguration
	err := json.Unmarshal(actionConfig, &ac)
	if err != nil {
		logger.Error("ACTION_PARSE_ERROR", "DoDeploymentAction", err, fmt.Sprintf("ActionConfig: %s", string(actionConfig)))
		return err
	}

	var ec *executionConfiguration
	err = json.Unmarshal(executionConfig, &ec)
	if err != nil {
		logger.Error("EXECUTION_PARSE_ERROR", "DoDeploymentAction", err, fmt.Sprintf("ExecutionConfig: %s", string(executionConfig)))
		return err
	}

	deployment, err := getCurrentDeploymentAtCircle(ec.OriginCircleID, ec.WorkspaceID, ac.MooveURL)
	if err != nil {
		dataErr := fmt.Sprintf("MooveUrl: %s, CircleId: %s, WorkspaceId: %s", ac.MooveURL, ec.OriginCircleID, ec.WorkspaceID)
		logger.Error("DO_CIRCLE_GET", "DoDeploymentAction", err, dataErr)
		return err
	}

	if deployment.BuildId == "" {
		err = errors.New("circle has no active build")
		dataErr := fmt.Sprintf("CircleId: %s, WorkspaceId: %s", ec.OriginCircleID, ec.WorkspaceID)
		logger.Error("DO_CIRCLE_GET", "DoDeploymentAction", err, dataErr)
		return err
	}

	user, err := getUserByEmail(os.Getenv("MOOVE_USER"), ac.MooveURL)
	if err != nil {
		logger.Error("DO_USER_FIND", "DoDeploymentAction", err, ac.MooveURL)
		return err
	}

	request := DeploymentRequest{
		AuthorID: user.Id,
		CircleID: ec.DestinationCircleID,
		BuildID:  deployment.BuildId,
	}

	err = deployBuildAtCircle(request, ec.WorkspaceID, ac.MooveURL)
	if err != nil {
		dataErr := fmt.Sprintf("MooveUrl: %s, WorkspaceId: %s, DestinationCircleId: %s, BuildId: %s, AuthorId: %s",
			ac.MooveURL, ec.WorkspaceID, ec.DestinationCircleID, deployment.BuildId, user.Id)
		logger.Error("DO_CIRCLE_DEPLOYMENT", "DoDeploymentAction", err, dataErr)
		return err
	}

	return nil
}

func ValidateExecutionConfiguration(executionConfig []byte) []error {
	errs := make([]error, 0)
	var config executionConfiguration
	err := json.Unmarshal(executionConfig, &config)
	if err != nil {
		logger.Error("VALIDATE_CIRCLE_ACTION_EXECUTION_CONFIG", "ValidateExecutionConfiguration", err, nil)
		return append(errs, errors.New("error validating execution configuration"))
	}

	if strings.TrimSpace(config.DestinationCircleID) == "" {
		errs = append(errs, errors.New("destination circle id is required"))
	}

	if strings.TrimSpace(config.OriginCircleID) == "" {
		errs = append(errs, errors.New("origin circle id is required"))
	}

	if strings.TrimSpace(config.WorkspaceID) == "" {
		errs = append(errs, errors.New("workspace id is required"))
	}

	return errs
}

func ValidateActionConfiguration(actionConfig []byte) []error {
	errs := make([]error, 0)
	var config actionConfiguration
	err := json.Unmarshal(actionConfig, &config)
	if err != nil {
		logger.Error("VALIDATE_CIRCLE_ACTION_CONFIG", "ValidateActionConfiguration", err, nil)
		return append(errs, errors.New("error validating action configuration"))
	}

	if strings.TrimSpace(config.MooveURL) == "" {
		logger.Error("VALIDATE_CIRCLE_ACTION_CONFIG", "ValidateActionConfiguration", err, fmt.Sprintf("%+v", config))
		errs = append(errs, errors.New("moove url is required"))
	}

	err = testConnection(config.MooveURL)
	if err != nil {
		logger.Error("VALIDATE_CIRCLE_ACTION_CONFIG", "ValidateActionConfiguration", err, fmt.Sprintf("%+v", config))
		errs = append(errs, errors.New("moove could not be reached"))
	}

	return errs
}
