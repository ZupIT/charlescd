package system_token

import (
	"time"

	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/google/uuid"
)

type RevokeSystemToken interface {
	Execute(id uuid.UUID) error
}

type revokeSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewRevokeSystemToken(repository repository.SystemTokenRepository) revokeSystemToken {
	return revokeSystemToken{
		systemTokenRepository: repository,
	}
}

func (r revokeSystemToken) Execute(id uuid.UUID) error {
	systemToken, err := r.systemTokenRepository.FindById(id)

	if err != nil {
		return logging.WithOperation(err, "RevokeSystemToken.Execute")
	}

	if !systemToken.Revoked {
		revokedAt := time.Now()

		systemToken.Revoked = true
		systemToken.RevokedAt = &revokedAt

		_, updateError := r.systemTokenRepository.Update(systemToken)

		if updateError != nil {
			return logging.WithOperation(updateError, "RevokeSystemToken.Execute")
		}
	}

	return nil
}
