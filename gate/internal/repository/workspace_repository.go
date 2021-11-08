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

package repository

import (
	"encoding/json"
	"fmt"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/nleof/goyesql"
	"gorm.io/gorm"
)

type WorkspaceRepository interface {
	FindByIds(workspaceIds []string) ([]domain.SimpleWorkspace, error)
	GetUserPermissionAtWorkspace(workspaceID string, userID string) ([][]domain.Permission, error)
	FindBySystemTokenID(systemTokenID string) ([]domain.SimpleWorkspace, error)
}

type workspaceRepository struct {
	queries goyesql.Queries
	db      *gorm.DB
}

func NewWorkspaceRepository(db *gorm.DB, queriesPath string) (WorkspaceRepository, error) {
	queries, err := goyesql.ParseFile(fmt.Sprintf("%s%s", queriesPath, "workspace_queries.sql"))
	if err != nil {
		return workspaceRepository{}, err
	}

	return workspaceRepository{
		queries: queries,
		db:      db,
	}, nil
}

func (workspaceRepository workspaceRepository) FindByIds(workspaceIDs []string) ([]domain.SimpleWorkspace, error) {
	var workspaces []models.Workspace

	res := workspaceRepository.db.Table("workspaces").Where("id IN ?", workspaceIDs).Scan(&workspaces)

	if res.Error != nil {
		return []domain.SimpleWorkspace{}, handleWorkspaceError("Find all workspaces failed", "WorkspaceRepository.CountByIds.Count", res.Error, logging.InternalError)
	}

	return mapper.WorkspacesModelToDomains(workspaces), nil
}

func (workspaceRepository workspaceRepository) GetUserPermissionAtWorkspace(workspaceID string, userID string) ([][]domain.Permission, error) {
	var permissionsJSON []json.RawMessage

	res := workspaceRepository.db.Raw(workspaceRepository.queries["find-user-permissions-at-workspace"], workspaceID, userID).Scan(&permissionsJSON)
	if res.Error != nil {
		return [][]domain.Permission{}, handleWorkspaceError("Find User permissions at Workspace", "WorkspaceRepository.GetUserPermissionAtWorkspace.Scan", res.Error, logging.InternalError)
	}

	var permissionsList = make([][]models.Permission, 0)
	for _, p := range permissionsJSON {
		var permissions []models.Permission
		err := json.Unmarshal(p, &permissions)
		if err != nil {
			return [][]domain.Permission{}, handleWorkspaceError("Error unmarshalling permissions", "WorkspaceRepository.GetUserPermissionAtWorkspace", res.Error, logging.InternalError)
		}
		permissionsList = append(permissionsList, permissions)
	}

	var permissionsListDomain = make([][]domain.Permission, 0)
	for _, p := range permissionsList {
		permissionsListDomain = append(permissionsListDomain, mapper.PermissionsModelToDomains(p))
	}

	return permissionsListDomain, nil
}

func (workspaceRepository workspaceRepository) FindBySystemTokenID(systemTokenID string) ([]domain.SimpleWorkspace, error) {
	var workspaces []models.Workspace

	res := workspaceRepository.db.Raw(workspaceRepository.queries["find-workspaces-by-system-token-id"], systemTokenID).Scan(&workspaces)

	if res.Error != nil {
		return []domain.SimpleWorkspace{}, handlePermissionError("Find all workspaces by system token id failed", "WorkspaceRepository.FindBySystemTokenID.Find", res.Error, logging.InternalError)
	}

	return mapper.WorkspacesModelToDomains(workspaces), nil
}

func handleWorkspaceError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}
