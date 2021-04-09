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

package repository

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"gorm.io/gorm"
)

type WorkspaceRepository interface {
	FindByIds(workspaceIds []string) ([]domain.SimpleWorkspace, error)
	GetUserPermissionAtWorkspace(workspaceId string, userId string) ([][]domain.Permission, error)
	FindWorkspacesBySystemTokenId(systemTokenId string) ([]domain.SimpleWorkspace, error)
}

type workspaceRepository struct {
	db *gorm.DB
}

func NewWorkspaceRepository(db *gorm.DB) (WorkspaceRepository, error) {
	return workspaceRepository{db: db}, nil
}

func (workspaceRepository workspaceRepository) FindByIds(workspaceIds []string) ([]domain.SimpleWorkspace, error) {
	var workspaces []models.Workspace

	res := workspaceRepository.db.Table("workspaces").Where("id IN ?", workspaceIds).Scan(&workspaces)

	if res.Error != nil {
		return []domain.SimpleWorkspace{}, handleWorkspaceError("Find all workspaces failed", "WorkspaceRepository.CountByIds.Count", res.Error, logging.InternalError)
	}

	return mapper.WorkspacesModelToDomains(workspaces), nil
}

func (workspaceRepository workspaceRepository) GetUserPermissionAtWorkspace(workspaceId string, userId string) ([][]domain.Permission, error) {
	var permissionsJson []json.RawMessage

	res := workspaceRepository.db.Raw(findUserPermissionsAtWorkspaceQuery, workspaceId, userId).Scan(&permissionsJson)
	if res.Error != nil {
		return [][]domain.Permission{}, handleWorkspaceError("Find User permissions at Workspace", "repository.GetUserPermissionAtWorkspace.Scan", res.Error, logging.InternalError)
	}

	var permissionsList = make([][]models.Permission, 0)
	for _, p := range permissionsJson {
		var permissions []models.Permission
		err := json.Unmarshal(p, &permissions)
		if err != nil {
			return [][]domain.Permission{}, handleWorkspaceError("Error unmarshalling permissions", "repository.GetUserPermissionAtWorkspace", res.Error, logging.InternalError)
		}
		permissionsList = append(permissionsList, permissions)
	}

	var permissionsListDomain = make([][]domain.Permission, 0)
	for _, p := range permissionsList {
		permissionsListDomain = append(permissionsListDomain, mapper.PermissionsModelToDomains(p))
	}

	return permissionsListDomain, nil
}

func (workspaceRepository workspaceRepository) FindWorkspacesBySystemTokenId(systemTokenId string) ([]domain.SimpleWorkspace, error) {
	var workspaces []models.Workspace

	res := workspaceRepository.db.Raw(findWorkspacesBySystemTokenIdQuery, systemTokenId).Scan(&workspaces)

	if res.Error != nil {
		return []domain.SimpleWorkspace{}, handlePermissionError("Find all workspaces failed", "PermissionRepository.FindWorkspacesBySystemTokenId.Find", res.Error, logging.InternalError)
	}

	return mapper.WorkspacesModelToDomains(workspaces), nil
}

func handleWorkspaceError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}

const findUserPermissionsAtWorkspaceQuery = `
	select wug.permissions
	from workspaces w
		inner join workspaces_user_groups wug on wug.workspace_id = ?
		inner join user_groups ug on ug.id  = wug.user_group_id
		inner join user_groups_users ugu on ugu.user_group_id = ug.id 
		inner join users u on ? = ugu.user_id
`

const findWorkspacesBySystemTokenIdQuery = `
	select
		id,
		name,
		created_at
	from
		workspaces w
	inner join system_tokens_workspaces stw on
		p.id = stw.workspace_id
	where
		stw .system_token_id = ?
`
