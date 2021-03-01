package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
)

type GetAllSystemToken interface {
	Execute(page int, size int) (domain.PageSystemToken, error)
}

type getAllSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewGetAllSystemToken(r repository.SystemTokenRepository) GetAllSystemToken {
	return getAllSystemToken{
		systemTokenRepository: r,
	}
}

func (f getAllSystemToken) Execute(page int, size int) (domain.PageSystemToken, error) {
	systemTokens, err := f.systemTokenRepository.FindAll(page, size)
	if err != nil {
		return domain.PageSystemToken{
			Content: []domain.SystemToken{},
			Page:    page,
			Size:    size,
		}, logging.WithOperation(err, "getAllSystemToken.Execute")
	}

	return systemTokens, nil
}
