package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
)

type AuthorizationRequest struct {
	Path string `json:"path" validate:"required,notblank"`

}
func (authorizationRequest AuthorizationRequest) RequestToInput() authorization.AuthorizationInput {
	return authorization.AuthorizationInput{
		Path: authorizationRequest.Path,
	}
}
