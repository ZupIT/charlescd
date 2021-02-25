package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
)

type FindAllSystemToken interface {
	Execute() ([]domain.SystemToken, error)
}

type findAllSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewFindAllSystemToken(r repository.SystemTokenRepository) FindAllSystemToken {
	return findAllSystemToken{
		systemTokenRepository: r,
	}
}

func (f findAllSystemToken) Execute() ([]domain.SystemToken, error) {
	systemTokens, err := f.systemTokenRepository.FindAll()
	if err != nil {
		return make([]domain.SystemToken, 0), logging.WithOperation(err, "findAllSystemToken.Execute")
	}

	return systemTokens, nil
}
