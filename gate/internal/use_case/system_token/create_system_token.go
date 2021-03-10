package system_token

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
)

type CreateSystemToken interface {
	Execute(authorization string, systemToken domain.SystemToken) (domain.SystemToken, error)
}

type createSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
	permissionRepository repository.PermissionRepository
	userRepository repository.UserRepository
	authTokenService service.AuthTokenService
}

func NewCreateSystemToken(systemTokenRepository repository.SystemTokenRepository, permissionRepository repository.PermissionRepository, userRepository repository.UserRepository, authTokenService service.AuthTokenService) CreateSystemToken {
	return createSystemToken{
		systemTokenRepository: systemTokenRepository,
		permissionRepository: permissionRepository,
		userRepository: userRepository,
		authTokenService: authTokenService,
	}
}

func (createSystemToken createSystemToken) Execute(authorization string, systemToken domain.SystemToken) (domain.SystemToken, error) {
	var authToken, err = createSystemToken.authTokenService.ParseAuthorizationToken(authorization)
	if err != nil {
		return domain.SystemToken{}, logging.NewError("Unable to parse authorization", err, logging.BusinessError, nil, "createSystemToken.Execute")
	}

	user, err := createSystemToken.userRepository.FindByEmail(authToken.Email)
	if err != nil {
		return domain.SystemToken{}, logging.NewError("Unable to find user by email", err, logging.BusinessError, nil, "createSystemToken.Execute")
	}

	systemToken.Author = user.Email

	permissions, err := createSystemToken.permissionRepository.FindAll(systemToken.Permissions)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "createSystemToken.Execute")
	}

	if len(permissions) != len(systemToken.Permissions) {
		return domain.SystemToken{}, logging.NewError("Some permissions were not found", errors.New("some permissions were not found"), logging.BusinessError, nil, "createSystemToken.Execute")
	}

	savedSystemToken, err := createSystemToken.systemTokenRepository.Create(systemToken, permissions)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "createSystemToken.Execute")
	}

	return savedSystemToken, nil
}

