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

package circleundeployment

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

type DeploymentResponse struct {
	Id      string `json:"id"`
	BuildId string `json:"buildId"`
}

type CircleResponse struct {
	Id                 string             `json:"id"`
	IsDefault          bool               `json:"default"`
	DeploymentResponse DeploymentResponse `json:"deployment"`
	WorkspaceId        string             `json:"workspaceId"`
}

type UndeploymentRequest struct {
	DeploymentId string `json:"deploymentId"`
	CircleID     string `json:"circleId"`
	BuildID      string `json:"buildId"`
}

func getCurrentDeploymentAtCircle(circleID, workspaceId, url string) (DeploymentResponse, error) {
	request, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/v2/circles/%s", url, circleID), nil)
	if err != nil {
		logger.Error("GET_CIRCLE_BY_ID", "getCurrentDeploymentAtCircle", err, nil)
		return DeploymentResponse{}, err
	}
	request.Header.Add("x-workspace-id", workspaceId)
	request.Header.Add("Authorization", os.Getenv("MOOVE_AUTH"))

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		logger.Error("GET_CIRCLE_BY_ID", "getCurrentDeploymentAtCircle", err, nil)
		return DeploymentResponse{}, err
	}
	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		logger.Error("GET_CIRCLE_BY_ID", "getCurrentDeploymentAtCircle", err, nil)
		return DeploymentResponse{}, err
	}

	if response.StatusCode != http.StatusOK {
		err = errors.New(fmt.Sprintf("error finding circle with http error: %s", strconv.Itoa(response.StatusCode)))
		logger.Error("GET_CIRCLE_BY_ID", "getCurrentDeploymentAtCircle", err, string(responseBody))
		return DeploymentResponse{}, err
	}

	var circle CircleResponse
	err = json.Unmarshal(responseBody, &circle)
	if err != nil {
		logger.Error("GET_CIRCLE_BY_ID", "getCurrentDeploymentAtCircle", err, string(responseBody))
		return DeploymentResponse{}, err
	}

	return circle.DeploymentResponse, nil
}

func undeployBuildAtCircle(deploymentId, workspaceId, url string) error {
	request, err := http.NewRequest(http.MethodPost, fmt.Sprintf("%s/v2/deployments/%s/undeploy", url, deploymentId), nil)
	if err != nil {
		logger.Error("DEPLOY_CIRCLE", "deployBuildAtCircle", err, nil)
		return err
	}
	request.Header.Add("Content-type", "application/json")
	request.Header.Add("x-workspace-id", workspaceId)
	request.Header.Add("Authorization", os.Getenv("MOOVE_AUTH"))

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		logger.Error("DEPLOY_CIRCLE", "deployBuildAtCircle", err, nil)
		return err
	}
	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		logger.Error("DEPLOY_CIRCLE", "deployBuildAtCircle", err, nil)
		return err
	}

	if response.StatusCode != http.StatusOK {
		err = errors.New(fmt.Sprintf("error undeploying at circle with http error: %s", strconv.Itoa(response.StatusCode)))
		logger.Error("DEPLOY_CIRCLE", "deployBuildAtCircle", err, string(responseBody))
		return err
	}

	return nil
}

func testConnection(url string) error {
	_, err := http.Get(url)
	if err != nil {
		logger.Error("Connection Filed", "testConnection", err, url)
		return err
	}

	return nil
}
