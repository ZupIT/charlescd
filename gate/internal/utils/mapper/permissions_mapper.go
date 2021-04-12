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

func PermissionModelToDomain(permission models.Permission) domain.Permission {
	return domain.Permission{
		ID:   permission.ID,
		Name: permission.Name,
	}
}

func PermissionDomainToModel(permission domain.Permission) models.Permission {
	return models.Permission{
		ID:   permission.ID,
		Name: permission.Name,
	}
}

func PermissionsDomainToModels(permissions []domain.Permission) []models.Permission {
	var permissionsModel []models.Permission
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, PermissionDomainToModel(permission))
	}
	return permissionsModel
}

func PermissionsModelToDomains(permissions []models.Permission) []domain.Permission {
	var permissionsModel []domain.Permission
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, PermissionModelToDomain(permission))
	}
	return permissionsModel
}

func GetPermissionModelsName(permissions []domain.Permission) []string {
	var permissionsModel []string
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, permission.Name)
	}
	return permissionsModel
}
