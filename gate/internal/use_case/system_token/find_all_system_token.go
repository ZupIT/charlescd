package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
)

type FindAllSystemToken interface {
	Execute(page int, size int) (domain.PageSystemToken, error)
}

type findAllSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewFindAllSystemToken(r repository.SystemTokenRepository) FindAllSystemToken {
	return findAllSystemToken{
		systemTokenRepository: r,
	}
}

func (f findAllSystemToken) Execute(page int, size int) (domain.PageSystemToken, error) {
	systemTokens, err := f.systemTokenRepository.FindAll(page, size)
	if err != nil {
		return domain.PageSystemToken{
			Content: []domain.SystemToken{},
			Page:    page,
			Size:    size,
		}, logging.WithOperation(err, "findAllSystemToken.Execute")
	}

	return systemTokens, nil
}
