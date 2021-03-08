package repository

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SystemTokenRepository interface {
	Create(systemToken domain.SystemToken, permissions []domain.Permission) (domain.SystemToken, error)
}

type systemTokenRepository struct {
	db      *gorm.DB
}

func NewSystemTokenRepository(db *gorm.DB) (SystemTokenRepository, error) {
	return systemTokenRepository{db: db}, nil
}

func (systemTokenRepository systemTokenRepository) Create(systemToken domain.SystemToken, permissions []domain.Permission) (domain.SystemToken, error) {
	systemToken.ID = uuid.New()
	systemTokenToSave := models.SystemTokenDomainToModel(systemToken, permissions)

	if res := systemTokenRepository.db.Table("system_tokens").Save(&systemTokenToSave); res.Error != nil {
		return domain.SystemToken{}, logging.NewError("Save system token failed", res.Error, nil, "repository.Create.Save")
	}

	return systemToken, nil
}