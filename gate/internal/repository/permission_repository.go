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
	"fmt"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/nleof/goyesql"
	"gorm.io/gorm"
)

type PermissionRepository interface {
	FindAll(permissions []string) ([]domain.Permission, error)
	FindBySystemTokenID(systemTokenID string) ([]domain.Permission, error)
}

type permissionRepository struct {
	queries goyesql.Queries
	db      *gorm.DB
}

func NewPermissionRepository(db *gorm.DB, queriesPath string) (PermissionRepository, error) {
	queries, err := goyesql.ParseFile(fmt.Sprintf("%s%s", queriesPath, "permission_queries.sql"))
	if err != nil {
		return permissionRepository{}, err
	}

	return permissionRepository{
		queries: queries,
		db:      db,
	}, nil
}

func (permissionRepository permissionRepository) FindAll(permissionNames []string) ([]domain.Permission, error) {
	var permissions []models.Permission

	res := permissionRepository.db.Table("permissions").Where("name IN ?", permissionNames).Find(&permissions)

	if res.Error != nil {
		return []domain.Permission{}, handlePermissionError("Find all permissions failed", "PermissionRepository.FindAll.Find", res.Error, logging.InternalError)
	}

	return mapper.PermissionsModelToDomains(permissions), nil
}

func (permissionRepository permissionRepository) FindBySystemTokenID(systemTokenID string) ([]domain.Permission, error) {
	var permissions []models.Permission

	res := permissionRepository.db.Raw(permissionRepository.queries["find-permissions-by-system-token-id"], systemTokenID).Scan(&permissions)

	if res.Error != nil {
		return []domain.Permission{}, handlePermissionError("Find all permissions by system token id failed", "PermissionRepository.FindBySystemTokenID.Find", res.Error, logging.InternalError)
	}

	return mapper.PermissionsModelToDomains(permissions), nil
}

func handlePermissionError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}
