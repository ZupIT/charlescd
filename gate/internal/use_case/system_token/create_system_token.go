/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package system_token

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/google/uuid"
	"strings"
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
		return domain.SystemToken{}, logging.WithOperation(err, "CreateSystemToken.Execute")
	}

	userExists, err := createSystemToken.userRepository.ExistsByEmail(authToken.Email)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "CreateSystemToken.Execute")
	}

	if !userExists {
		return domain.SystemToken{}, logging.NewError("User not found", errors.New("user not found"), logging.BusinessError, nil, "CreateSystemToken.Execute")
	}

	permissions, err := createSystemToken.permissionRepository.FindAll(input.Permissions)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "CreateSystemToken.Execute")
	}

	if len(permissions) != len(input.Permissions) {
		return domain.SystemToken{}, logging.NewError("Some permissions were not found", errors.New("some permissions were not found"), logging.BusinessError, nil, "CreateSystemToken.Execute")
	}

	workspaces, err := createSystemToken.workspaceRepository.FindByIds(input.Workspaces)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "CreateSystemToken.Execute")
	}

	if len(workspaces) != len(input.Workspaces) {
		return domain.SystemToken{}, logging.NewError("Some workspaces were not found", errors.New("some workspaces were not found"), logging.BusinessError, nil, "CreateSystemToken.Execute")
	}

	systemToken := CreateSystemTokenInput.InputToDomain(input)

	systemToken.Author = authToken.Email
	systemToken.Permissions = permissions
	systemToken.Workspaces = workspaces
	systemToken.Token = strings.ReplaceAll(uuid.New().String(), "-", "")

	savedSystemToken, err := createSystemToken.systemTokenRepository.Create(systemToken)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "CreateSystemToken.Execute")
	}

	userToSave := savedSystemToken.CreateUserFromSystemToken()
	_, err = createSystemToken.userRepository.Create(userToSave)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "CreateSystemToken.Execute")
	}

	return savedSystemToken, nil
}
