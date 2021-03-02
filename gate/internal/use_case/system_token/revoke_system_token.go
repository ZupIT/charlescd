package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/google/uuid"
)

type RevokeSystemToken interface {
	Execute(id uuid.UUID) error
}

type revokeSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}
