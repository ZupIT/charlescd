package mapper

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
)

func PermissionModelToDomain(permission models.Permission) domain.Permission {
	return domain.Permission{
		ID:        permission.ID,
		Name:      permission.Name,
	}
}

func PermissionDomainToModel(permission domain.Permission) models.Permission {
	return models.Permission{
		ID:        permission.ID,
		Name:      permission.Name,
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
