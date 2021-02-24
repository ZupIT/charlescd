package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
)

type CreateSystemToken interface {
	Execute(systemToken domain.SystemToken) (domain.SystemToken, error)
}

type createSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewCreateSystemToken(systemTokenRepository repository.SystemTokenRepository) CreateSystemToken {
	return createSystemToken{
		systemTokenRepository: systemTokenRepository,
	}
}

func (createSystemToken createSystemToken) Execute(systemToken domain.SystemToken) (domain.SystemToken, error) {
	savedSystemToken, err := createSystemToken.systemTokenRepository.Create(systemToken)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "createSystemToken.Execute")
	}

	return savedSystemToken, nil
}