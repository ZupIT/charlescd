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

package mozart

import (
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/execution"
	"octopipe/pkg/git"
	"octopipe/pkg/template"
)

type MozartUseCases interface {
	Start(deployment *deployment.Deployment)
}

type MozartManager struct {
	executions    execution.ManagerUseCases
	template      template.ManagerUseCases
	git           git.ManagerUseCases
	deployer      deployer.ManagerUseCases
	cloudprovider cloudprovider.ManagerUseCases
}

func NewMozartManager(execution execution.ManagerUseCases,
	template template.ManagerUseCases,
	git git.ManagerUseCases,
	deployer deployer.ManagerUseCases,
	cloudprovider cloudprovider.ManagerUseCases,
) MozartUseCases {
	return &MozartManager{
		execution,
		template,
		git,
		deployer,
		cloudprovider,
	}
}

func (mozartManager *MozartManager) Start(deployment *deployment.Deployment) {
	pipeline := NewMozart(mozartManager, deployment)
	pipeline.Do(deployment)
}
