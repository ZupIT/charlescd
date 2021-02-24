package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
)

type PermissionResponse struct {
	ID uuid.UUID
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