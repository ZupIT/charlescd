package repository

import (
	"fmt"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/google/uuid"
	"github.com/nleof/goyesql"
	"gorm.io/gorm"
)

type SystemTokenRepository interface {
	Create(systemToken domain.SystemToken) (domain.SystemToken, error)
	FindAll() ([]domain.SystemToken, error)
}

type systemTokenRepository struct {
	db      *gorm.DB
	queries goyesql.Queries
}

func NewSystemTokenRepository(db *gorm.DB, queriesPath string) (SystemTokenRepository, error) {
	queries, err := goyesql.ParseFile(fmt.Sprintf("%s/%s", queriesPath, "system_token_queries.sql"))
	if err != nil {
		return systemTokenRepository{}, err
	}

	return systemTokenRepository{db: db, queries: queries}, nil
}

func (systemTokenRepository systemTokenRepository) Create(systemToken domain.SystemToken) (domain.SystemToken, error) {
	systemToken.ID = uuid.New()
	systemTokenToSave := models.SystemTokenDomainToModel(systemToken)

	if res := systemTokenRepository.db.Save(&systemTokenToSave); res.Error != nil {
		return domain.SystemToken{}, logging.NewError("Save system token failed", res.Error, nil, "repository.Create.Save")
	}

	return systemToken, nil
}

func (systemTokenRepository systemTokenRepository) FindAll() ([]domain.SystemToken, error) {
	var systemToken []models.SystemToken

	res := systemTokenRepository.db.Find(&systemToken)
	if res.Error != nil {
		return nil, logging.NewError("Find all system tokens failed", res.Error, nil, "repository.FindAll.Find")
	}

	systemTokenFound := make([]domain.SystemToken, 0)
	for _, st := range systemToken {
		systemTokenFound = append(systemTokenFound, models.SystemTokenModelToDomain(st))
	}

	return systemTokenFound, nil
}
