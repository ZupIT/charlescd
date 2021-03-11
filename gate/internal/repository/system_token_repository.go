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
	FindAll(pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error)
	FindById(id uuid.UUID) (domain.SystemToken, error)
	Update(systemToken domain.SystemToken) error
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

	if res := systemTokenRepository.db.Table("system_tokens").Create(&systemTokenToSave); res.Error != nil {
		return domain.SystemToken{}, handleSystemTokenError("Save system token failed", "unit.Create.Save", res.Error, logging.InternalError)
	}

	return systemToken, nil
}

func (systemTokenRepository systemTokenRepository) FindAll(pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error) {
	var systemTokens []models.SystemToken
	var page = pageRequest

	res := systemTokenRepository.db.Where("revoked = false").
		Order(page.Sort).
		Offset(page.Offset()).
		Limit(page.PageSize).
		Find(&systemTokens)
	if res.Error != nil {
		return []domain.SystemToken{}, page, handleSystemTokenError("Find all tokens failed", "unit.GetAll.Find", res.Error, logging.InternalError)
	}

	res = systemTokenRepository.db.Table("system_tokens").
		Where("revoked = false").
		Count(&page.Total)
	if res.Error != nil {
		return []domain.SystemToken{}, page, handleSystemTokenError("Find all tokens failed", "unit.GetAll.Count", res.Error, logging.InternalError)
	}

	return mapper.SystemTokensModelToDomains(systemTokens), page, nil
}

func (systemTokenRepository systemTokenRepository) FindById(id uuid.UUID) (domain.SystemToken, error)  {
	var systemToken models.SystemToken

	res := systemTokenRepository.db.Model(models.SystemToken{}).
		Where("id = ?", id).
		First(&systemToken)

	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return domain.SystemToken{}, handleSystemTokenError("Token not found", "unit.GetById.First", res.Error, logging.NotFoundError)
		}
		return domain.SystemToken{}, handleSystemTokenError("Find token failed", "unit.GetById.First", res.Error, logging.InternalError)
	}
	return mapper.SystemTokenModelToDomain(systemToken), nil
}

func (systemTokenRepository systemTokenRepository) Update(systemToken domain.SystemToken) error {

	systemTokenToUpdate := mapper.SystemTokenDomainToModel(systemToken, systemToken.Permissions)

	if res := systemTokenRepository.db.Model(models.SystemToken{}).
		Where("id = ?", systemToken.ID).Updates(&systemTokenToUpdate); res.Error != nil {
		return handleSystemTokenError("Update system token failed", "repository.Update.Updates", res.Error, logging.InternalError)
	}

	return nil
}

func handleSystemTokenError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}
