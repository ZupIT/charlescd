package authorization

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/casbin/casbin/v2"
)

type DoAuthorization interface {
	Execute(authorizationToken string, workspaceId string, input Input) error
}

type doAuthorization struct {
	enforcer            *casbin.Enforcer
	userRepository      repository.UserRepository
	workspaceRepository repository.WorkspaceRepository
	authTokenService    service.AuthTokenService
}

func NewDoAuthorization(enforcer *casbin.Enforcer, userRepository repository.UserRepository, workspaceRepository repository.WorkspaceRepository, authTokenService service.AuthTokenService) DoAuthorization {
	return doAuthorization{
		enforcer:            enforcer,
		userRepository:      userRepository,
		workspaceRepository: workspaceRepository,
		authTokenService:    authTokenService,
	}
}

func (doAuthorization doAuthorization) Execute(authorizationToken string, workspaceId string, input Input) error {
	allowed, err := doAuthorization.enforcer.Enforce("public", input.Path, input.Method)
	if err != nil {
		return handleAuthError("Forbidden", "forbidden", "Authorizer", logging.InternalError)
	}
	if allowed {
		return nil
	}

	if authorizationToken == "" {
		return handleAuthError("Forbidden", "invalid authorization token", "Authorizer", logging.ForbiddenError)
	}

	allowed, err = doAuthorization.enforcer.Enforce("management", input.Path, input.Method)
	if err != nil {
		return handleAuthError("Forbidden", "forbidden", "Authorizer", logging.InternalError)
	}

	if allowed {
		return nil
	}

	if workspaceId == "" {
		return handleAuthError("Forbidden", "invalid workspace", "Authorizer", logging.ForbiddenError)
	}

	userToken, err := doAuthorization.authTokenService.ParseAuthorizationToken(authorizationToken)
	if err != nil {
		return handleAuthError("Forbidden", "invalid authorization token", "Authorizer", logging.ForbiddenError)
	}

	user, err := doAuthorization.userRepository.GetByEmail(userToken.Email)
	if err != nil {
		return handleAuthError("Forbidden", "invalid user", "Authorizer", logging.ForbiddenError)
	}

	if user.IsRoot {
		return nil
	}

	userPermission, err := doAuthorization.workspaceRepository.GetUserPermissionAtWorkspace(workspaceId, user.ID.String())
	for _, ps := range userPermission {
		for _, p := range ps {
			allowed, err = doAuthorization.enforcer.Enforce(p.Name, input.Path, input.Method)
			if err != nil {
				return handleAuthError("Forbidden", "forbidden", "Authorizer", logging.InternalError)
			}

			if allowed {
				return nil
			}
		}
	}

	return handleAuthError("Forbidden", "forbidden", "Authorizer", logging.ForbiddenError)
}

func handleAuthError(message string, details string, operation string, errType string) error {
	return logging.NewError(message, errors.New(details), errType, nil, operation)
}
