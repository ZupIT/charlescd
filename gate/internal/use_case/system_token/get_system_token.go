package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/google/uuid"
)

type GetSystemToken interface {
	Execute(id uuid.UUID) (domain.SystemToken, error)
}

type getSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewGetSystemToken(repository repository.SystemTokenRepository)  GetSystemToken {
	return getSystemToken{
		systemTokenRepository: repository,
	}
}

func (s getSystemToken) Execute(id uuid.UUID) (domain.SystemToken, error)  {
	systemToken, err := s.systemTokenRepository.FindById(id)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "GetSystemToken.Execute")
	}
	return systemToken, nil
}