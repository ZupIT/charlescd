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

package deployer

import (
	"errors"
	"octopipe/pkg/cloudprovider"

	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
)

const (
	DeployAction   = "DEPLOY"
	UndeployAction = "UNDEPLOY"
)

type Resource struct {
	Action      string
	ForceUpdate bool
	Manifest    *unstructured.Unstructured
	Rollout     string
	Type        []string
	Config      cloudprovider.CloudproviderUseCases
	Namespace   string
}

type DeployerUseCases interface {
	Do() error
}

func (deployerManager *DeployerManager) NewDeployer(resource *Resource) (DeployerUseCases, error) {
	switch resource.Action {
	case DeployAction:
		return NewDeploy(resource), nil
	case UndeployAction:
		return NewUndeploy(resource), nil
	default:
		return nil, errors.New("deployer action not found")
	}
}
