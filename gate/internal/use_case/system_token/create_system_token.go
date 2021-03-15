package system_token

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
)

type CreateSystemToken interface {
	Execute(authorization string, input CreateSystemTokenInput) (domain.SystemToken, error)
}

type createSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
	permissionRepository repository.PermissionRepository
	userRepository repository.UserRepository
	workspaceRepository repository.WorkspaceRepository
	authTokenService service.AuthTokenService
}

func NewCreateSystemToken(systemTokenRepository repository.SystemTokenRepository, permissionRepository repository.PermissionRepository, userRepository repository.UserRepository, workspaceRepository repository.WorkspaceRepository, authTokenService service.AuthTokenService) CreateSystemToken {
	return createSystemToken{
		systemTokenRepository: systemTokenRepository,
		permissionRepository: permissionRepository,
		userRepository: userRepository,
		workspaceRepository: workspaceRepository,
		authTokenService: authTokenService,
	}
}

func (createSystemToken createSystemToken) Execute(authorization string, input CreateSystemTokenInput) (domain.SystemToken, error) {
	var authToken, err = createSystemToken.authTokenService.ParseAuthorizationToken(authorization)
	if err != nil {
		return domain.SystemToken{}, logging.NewError("Unable to parse authorization", err, logging.BusinessError, nil, "createSystemToken.Execute")
	}

	user, err := createSystemToken.userRepository.FindByEmail(authToken.Email)
	if err != nil {
		return domain.SystemToken{}, logging.NewError("Unable to find user by email", err, logging.BusinessError, nil, "createSystemToken.Execute")
	}

	permissions, err := createSystemToken.permissionRepository.FindAll(input.Permissions)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "createSystemToken.Execute")
	}

	if len(permissions) != len(input.Permissions) {
		return domain.SystemToken{}, logging.NewError("Some permissions were not found", errors.New("some permissions were not found"), logging.BusinessError, nil, "createSystemToken.Execute")
	}

	workspacesFound, err := createSystemToken.workspaceRepository.ExistsByIds(input.Workspaces)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "createSystemToken.Execute")
	}

	if int(workspacesFound) < len(input.Workspaces) {
		return domain.SystemToken{}, logging.NewError("Some workspaces were not found", errors.New("some workspaces were not found"), logging.BusinessError, nil, "createSystemToken.Execute")
	}

	systemToken := CreateSystemTokenInput.InputToDomain(input)

	systemToken.Author = user.Email
	systemToken.Permissions = permissions

	savedSystemToken, err := createSystemToken.systemTokenRepository.Create(systemToken, permissions)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "createSystemToken.Execute")
	}

	return savedSystemToken, nil
}
