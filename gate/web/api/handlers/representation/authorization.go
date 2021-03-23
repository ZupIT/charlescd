package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
)

type AuthorizationRequest struct {
	Path   string `json:"path" validate:"required,notblank"`
	Method string `json:"method" validate:"required,notblank"`
}

func (authorizationRequest AuthorizationRequest) RequestToInput() authorization.Input {
	return authorization.Input{
		Path: authorizationRequest.Path,
		Method: authorizationRequest.Method,
	}
}
