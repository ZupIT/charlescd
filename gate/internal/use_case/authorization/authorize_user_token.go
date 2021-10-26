/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package authorization

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
)

type AuthorizeUserToken interface {
	Execute(authorizationToken string, workspaceID string, authorization domain.Authorization) error
}

type authorizeUserToken struct {
	securityFilterService service.SecurityFilterService
	userRepository        repository.UserRepository
	workspaceRepository   repository.WorkspaceRepository
	authTokenService      service.AuthTokenService
}

func NewAuthorizeUserToken(securityFilterService service.SecurityFilterService, userRepository repository.UserRepository, workspaceRepository repository.WorkspaceRepository, authTokenService service.AuthTokenService) AuthorizeUserToken {
	return authorizeUserToken{
		securityFilterService: securityFilterService,
		userRepository:        userRepository,
		workspaceRepository:   workspaceRepository,
		authTokenService:      authTokenService,
	}
}

func (authorizeUserToken authorizeUserToken) Execute(authorizationToken string, workspaceID string, authorization domain.Authorization) error {
	allowed, err := authorizeUserToken.securityFilterService.Authorize("public", authorization.Path, authorization.Method)
	if err != nil {
		return logging.NewError("Forbidden", err, logging.InternalError, nil, "authorize.userToken")
	}
	if allowed {
		return nil
	}

	if authorizationToken == "" {
		return logging.NewError("Forbidden", errors.New("invalid authorization token"), logging.ForbiddenError, nil, "authorize.userToken")
	}

	allowed, err = authorizeUserToken.securityFilterService.Authorize("management", authorization.Path, authorization.Method)
	if err != nil {
		return logging.NewError("Forbidden", err, logging.InternalError, nil, "authorize.userToken")
	}

	if allowed {
		return nil
	}

	userToken, err := authorizeUserToken.authTokenService.ParseAuthorizationToken(authorizationToken)
	if err != nil {
		return logging.WithOperation(err, "authorize.userToken")
	}

	user, err := authorizeUserToken.userRepository.GetByEmail(userToken.Email)
	if err != nil {
		return logging.WithOperation(err, "authorize.userToken")

	}

	if user.IsRoot {
		return nil
	}

	userPermission, err := authorizeUserToken.workspaceRepository.GetUserPermissionAtWorkspace(workspaceID, user.ID.String())

	if err != nil {
		return logging.WithOperation(err, "authorize.userToken")
	}
	for _, ps := range userPermission {
		for _, p := range ps {
			allowed, err = authorizeUserToken.securityFilterService.Authorize(p.Name, authorization.Path, authorization.Method)
			if err != nil {
				return logging.NewError("Forbidden", err, logging.InternalError, nil, "authorize.userToken")
			}

			if allowed {
				return nil
			}
		}
	}

	return logging.NewError("Forbidden", errors.New("forbidden"), logging.ForbiddenError, nil, "authorize.userToken")
}
