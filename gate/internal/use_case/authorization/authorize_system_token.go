package authorization

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/google/uuid"
)

type AuthorizeSystemToken interface {
	Execute(authorizationToken string, workspaceId string, input Input) error
}

type authorizeSystemToken struct {
	enforcer              service.SecurityFilterService
	systemTokenRepository repository.SystemTokenRepository
}

func NewAuthorizeSystemToken(enforcer service.SecurityFilterService, systemTokenRepository repository.SystemTokenRepository) AuthorizeSystemToken {
	return authorizeSystemToken{
		enforcer:              enforcer,
		systemTokenRepository: systemTokenRepository,
	}
}

func (authorizeSystemToken authorizeSystemToken) Execute(authorizationToken string, workspaceId string, input Input) error {
	allowed, err := authorizeSystemToken.enforcer.Authorize("public", input.Path, input.Method)
	if err != nil {
		return logging.NewError("Forbidden", err, logging.InternalError, nil, "authorize.systemToken")
	}

	if allowed {
		return nil
	}

	systemToken, err := authorizeSystemToken.systemTokenRepository.FindById(uuid.MustParse(authorizationToken))
	if err != nil {
		return logging.WithOperation(err, "authorize.systemToken")
	}

	if !contains(systemToken.Workspaces, workspaceId) {
		return logging.NewError("Forbidden", errors.New("forbidden"), logging.ForbiddenError, nil, "authorize.systemToken")
	}

	for _, st := range systemToken.Permissions {
		allowed, err = authorizeSystemToken.enforcer.Authorize(st.Name, input.Path, input.Method)
		if err != nil {
			return logging.NewError("Forbidden", err, logging.InternalError, nil, "authorize.systemToken")
		}

		if allowed {
			return nil
		}
	}
	return logging.NewError("Forbidden", errors.New("forbidden"), logging.ForbiddenError, nil, "authorize.systemToken")
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
