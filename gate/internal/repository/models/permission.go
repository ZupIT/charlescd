package models

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
	"time"
)

type Permission struct {
	ID        uuid.UUID
	Name      string
	CreatedAt time.Time
}

func PermissionDomainToModel(permission domain.Permission) Permission {
	return Permission{
		ID:        permission.ID,
		Name:      permission.Name,
		CreatedAt: permission.CreatedAt,
	}
}

func PermissionsDomainToModels(permissions []domain.Permission) []Permission {
	var permissionsModel []Permission
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, PermissionDomainToModel(permission))
	}
	return permissionsModel
}
