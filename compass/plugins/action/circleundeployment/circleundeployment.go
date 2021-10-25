/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"encoding/json"
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"github.com/ZupIT/charlescd/compass/plugins/action/commons"
	"strings"
)

type executionConfiguration struct {
	DestinationCircleID string `json:"destinationCircleID"`
	WorkspaceID         string `json:"workspaceId"`
}

type actionConfiguration struct {
	MooveURL string `json:"mooveUrl"`
}

func Do(actionConfig []byte, executionConfig []byte) error {
	var ac *actionConfiguration
	err := json.Unmarshal(actionConfig, &ac)
	if err != nil {
		logger.Error("ACTION_PARSE_ERROR", "DoUndeploymentAction", err, fmt.Sprintf("ActionConfig: %s", string(actionConfig)))
		return err
	}

	var ec *executionConfiguration
	err = json.Unmarshal(executionConfig, &ec)
	if err != nil {
		logger.Error("EXECUTION_PARSE_ERROR", "DoUndeploymentAction", err, fmt.Sprintf("ExecutionConfig: %s", string(executionConfig)))
		return err
	}

	deployment, err := commons.GetCurrentDeploymentAtCircle(ec.DestinationCircleID, ec.WorkspaceID, ac.MooveURL)
	if err != nil {
		dataErr := fmt.Sprintf("MooveUrl: %s, DestinationCircleID: %s, WorkspaceID: %s", ac.MooveURL, ec.DestinationCircleID, ec.WorkspaceID)
		logger.Error("DO_CIRCLE_GET", "DoUndeploymentAction", err, dataErr)
		return err
	}

	if deployment.BuildID == "" {
		err = errors.New("circle has no active build")
		dataErr := fmt.Sprintf("DestinationCircleID: %s, WorkspaceID: %s", ec.DestinationCircleID, ec.WorkspaceID)
		logger.Error("DO_CIRCLE_GET", "DoUndeploymentAction", err, dataErr)
		return err
	}

	err = commons.UndeployBuildAtCircle(deployment.ID, ec.WorkspaceID, ac.MooveURL)
	if err != nil {
		dataErr := fmt.Sprintf("MooveUrl: %s, WorkspaceID: %s, DestinationCircleID: %s, BuildID: %s",
			ac.MooveURL, ec.WorkspaceID, ec.DestinationCircleID, deployment.BuildID)
		logger.Error("DO_CIRCLE_UNDEPLOYMENT", "DoUndeploymentAction", err, dataErr)
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
		errs = append(errs, errors.New("circle id is required"))
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

	err = commons.TestConnection(config.MooveURL)
	if err != nil {
		logger.Error("VALIDATE_CIRCLE_ACTION_CONFIG", "ValidateActionConfiguration", err, fmt.Sprintf("%+v", config))
		errs = append(errs, errors.New("moove could not be reached"))
	}

	return errs
}
