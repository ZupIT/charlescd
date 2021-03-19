package authorization

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/casbin/casbin/v2"
	"github.com/google/uuid"
	"reflect"
)

type DoAuthorization interface {
	Execute(authorizationToken string, workspaceId string, input AuthorizationInput) error
}

type doAuthorization struct {
	enforcer *casbin.Enforcer
	userRepository repository.UserRepository
	authTokenService service.AuthTokenService
}

func NewDoAuthorization(enforcer  *casbin.Enforcer, userRepository repository.UserRepository, authTokenService service.AuthTokenService) DoAuthorization {
	return doAuthorization{
		enforcer: enforcer,
		userRepository: userRepository,
		authTokenService: authTokenService,
	}
}

func (doAuthorization doAuthorization) Execute(authorizationToken string, workspaceId string, input AuthorizationInput) error {
	if authorizationToken == "" {
		return handleAuthError("Forbidden", "invalid authorization token", "Authorizer", logging.ForbiddenError)
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

	userWorkspaces := getUserWorkspaces(user.WorkspacesPermissions)
	if itemExists(userWorkspaces, workspaceId) {
		return handleAuthError("Forbidden", "invalid workspace", "Authorizer", logging.ForbiddenError)
	}

	userRole := getUserRole(user.WorkspacesPermissions)
	authorized, err := doAuthorization.enforcer.Enforce(userRole, input.Path, input.Method)
	if err != nil {
		return handleAuthError("InternalServerError", "Unexpected error", "Authorizer", logging.InternalError)
	}

	if authorized {
		return nil
	}

	return handleAuthError("Forbidden", "forbidden", "Authorizer", logging.ForbiddenError)
}

func handleAuthError(message string, details string, operation string, errType string) error{
	 return logging.NewError(message, errors.New(details), errType, nil, operation)
}


func itemExists(slice interface{}, item interface{}) bool {
	s := reflect.ValueOf(slice)

	if s.Kind() != reflect.Slice {
		panic("Invalid data-type")
	}

	for i := 0; i < s.Len(); i++ {
		if s.Index(i).Interface() == item {
			return true
		}
	}

	return false
}

func getUserWorkspaces(workspacePermissions []domain.WorkspacePermission) []uuid.UUID {
	var userWorkspaces []uuid.UUID
	for _, value := range workspacePermissions {
		userWorkspaces = append(userWorkspaces, value.ID)
	}
	return userWorkspaces
}

func getUserRole(workspacePermissions []domain.WorkspacePermission) string {
	//TODO
	return ""
}

const (
	ROOT      = "Root"
	MANTAINER = "Mantainer"
	PUBLIC    = "Public"
)