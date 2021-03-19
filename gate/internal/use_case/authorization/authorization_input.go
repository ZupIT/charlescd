package authorization

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
)

type AuthorizationInput struct {
	Path string
	Method string
}

func (input AuthorizationInput) InputToDomain() domain.Authorization {
	return domain.Authorization{
		Path: input.Path,
	}
}
