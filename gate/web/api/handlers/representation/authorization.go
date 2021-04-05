package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
)

type AuthorizationRequest struct {
	Path   string `json:"path" validate:"required,notblank"`
	Method string `json:"method" validate:"required,notblank"`
}

func (authorizationRequest AuthorizationRequest) RequestToDomain() domain.Authorization {
	return domain.Authorization{
		Path: authorizationRequest.Path,
		Method: authorizationRequest.Method,
	}
}
