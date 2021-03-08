package repository

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SystemTokenRepository interface {
	Create(systemToken domain.SystemToken, permissions []domain.Permission) (domain.SystemToken, error)
	FindById(id uuid.UUID) (domain.SystemToken, error)
}

type systemTokenRepository struct {
	db      *gorm.DB
}

func NewSystemTokenRepository(db *gorm.DB) (SystemTokenRepository, error) {
	return systemTokenRepository{db: db}, nil
}

func (systemTokenRepository systemTokenRepository) Create(systemToken domain.SystemToken, permissions []domain.Permission) (domain.SystemToken, error) {
	systemToken.ID = uuid.New()
	systemTokenToSave := mapper.SystemTokenDomainToModel(systemToken, permissions)

	if res := systemTokenRepository.db.Table("system_tokens").Save(&systemTokenToSave); res.Error != nil {
		return handleError("Save system token failed", "unit.Create.Save", res.Error, logging.InternalError)
	}

	return systemToken, nil
}

func (systemTokenRepository systemTokenRepository) FindById(id uuid.UUID) (domain.SystemToken, error)  {
	var systemToken models.SystemToken

	res := systemTokenRepository.db.Model(models.SystemToken{}).Where("id = ?", id).First(&systemToken)
	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return handleError("Token not found", "unit.GetById.First", res.Error, logging.NotFoundError)
		}
		return handleError("Find token failed", "unit.GetById.First", res.Error, logging.InternalError)
	}
	return mapper.SystemTokenModelToDomain(systemToken), nil
}

func handleError(message string, operation string, err error, errType string) (domain.SystemToken, error) {
	return domain.SystemToken{}, logging.NewError(message, err, errType, nil, operation)
}
