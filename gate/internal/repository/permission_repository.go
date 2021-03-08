package repository

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"gorm.io/gorm"
)

type PermissionRepository interface {
	FindAll(permissions []string) ([]domain.Permission, error)
}

type permissionRepository struct {
	db      *gorm.DB
}

func NewPermissionRepository(db *gorm.DB) (PermissionRepository, error) {
	return permissionRepository{db: db}, nil
}

func (permissionRepository permissionRepository) FindAll(permissionNames []string) ([]domain.Permission, error) {
	var permissions []models.Permission

	res := permissionRepository.db.Table("permissions").Where(permissionNames).Find(&permissions)

	if res.Error != nil {
		return []domain.Permission{}, logging.NewError("Find all permissions failed", res.Error, nil, "repository.FindAll.Find")
	}

	return permissions
}

func handlerError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)

}