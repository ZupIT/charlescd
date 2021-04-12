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

package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
)

type PermissionResponse struct {
	ID   uuid.UUID
	Name string
}

func PermissionToResponse(permission domain.Permission) PermissionResponse {
	return PermissionResponse{
		ID:   permission.ID,
		Name: permission.Name,
	}
}

func PermissionsToResponse(permissions []domain.Permission) []PermissionResponse {
	var permissionsResponse []PermissionResponse
	for _, permission := range permissions {
		permissionsResponse = append(permissionsResponse, PermissionToResponse(permission))
	}
	return permissionsResponse
}
