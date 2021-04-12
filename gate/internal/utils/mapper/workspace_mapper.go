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

package mapper

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
)

func WorkspaceModelToSimpleDomain(workspace models.Workspace) domain.SimpleWorkspace {
	return domain.SimpleWorkspace{
		ID:   workspace.ID,
		Name: workspace.Name,
	}
}

func WorkspacesModelToDomains(simpleWorkspaces []models.Workspace) []domain.SimpleWorkspace {
	var simpleWorkspacesDomain []domain.SimpleWorkspace
	for _, simpleWorkspace := range simpleWorkspaces {
		simpleWorkspacesDomain = append(simpleWorkspacesDomain, WorkspaceModelToSimpleDomain(simpleWorkspace))
	}
	return simpleWorkspacesDomain
}

func WorkspaceDomainToModel(workspace domain.SimpleWorkspace) models.Workspace {
	return models.Workspace{
		ID:   workspace.ID,
		Name: workspace.Name,
	}
}

func WorkspacesDomainToModels(workspaces []domain.SimpleWorkspace) []models.Workspace {
	var permissionsModel []models.Workspace
	for _, workspace := range workspaces {
		permissionsModel = append(permissionsModel, WorkspaceDomainToModel(workspace))
	}
	return permissionsModel
}
