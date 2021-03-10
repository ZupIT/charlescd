package mapper

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
)

func PermissionsDomainToModels(permissions []domain.Permission) []models.Permission {
	var permissionsModel []models.Permission
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, models.Permission(permission))
	}
	return permissionsModel
}

func PermissionsModelToDomains(permissions []models.Permission) []domain.Permission {
	var permissionsModel []domain.Permission
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, domain.Permission(permission))
	}
	return permissionsModel
}

func GetPermissionModelsName(permissions []models.Permission) []string {
	var permissionsModel []string
	for _, permission := range permissions {
		permissionsModel = append(permissionsModel, permission.Name)
	}
	return permissionsModel
}