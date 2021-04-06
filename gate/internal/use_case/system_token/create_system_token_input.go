package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
	"time"
)

type CreateSystemTokenInput struct {
	Name string
	Permissions []string
	Workspaces []string
}

func (input CreateSystemTokenInput) InputToDomain() domain.SystemToken {
	createdAt := time.Now()
	return domain.SystemToken{
		ID:          uuid.New(),
		Name:        input.Name,
		Revoked:     false,
		Permissions: []domain.Permission{},
		Workspaces: input.Workspaces,
		TokenValue: "",
		CreatedAt:   &createdAt,
		RevokedAt:   nil,
		LastUsedAt:  nil,
		Author: "",
	}
}
