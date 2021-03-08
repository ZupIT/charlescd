package mapper

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
)

func PermissionDomainToModel(permission domain.Permission) models.Permission {
	return models.Permission{
		ID:        permission.ID,
		Name:      permission.Name,
		CreatedAt: permission.CreatedAt,
	}
}

func PermissionsDomainToModels(permissions []domain.Permission) []models.Permission {
	var permissionsModel []models.Permission
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, PermissionDomainToModel(permission))
	}
	return permissionsModel
}

func PermissionsModelsToDomains(permissions []models.Permission) []string {
	var permissionsModel []string
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, permission.Name)
	}
	return permissionsModel
}