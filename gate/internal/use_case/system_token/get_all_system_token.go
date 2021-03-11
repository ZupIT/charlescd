package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
)

type GetAllSystemToken interface {
	Execute(pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error)
}

type getAllSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewGetAllSystemToken(r repository.SystemTokenRepository) GetAllSystemToken {
	return getAllSystemToken{
		systemTokenRepository: r,
	}
}

func (f getAllSystemToken) Execute(pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error) {
	systemTokens, page, err := f.systemTokenRepository.FindAll(pageRequest)
	if err != nil {
		return []domain.SystemToken{}, page, logging.WithOperation(err, "getAllSystemToken.Execute")
	}

	return systemTokens, page, nil
}
