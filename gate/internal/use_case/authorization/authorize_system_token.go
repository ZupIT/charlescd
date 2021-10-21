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

type AuthorizeSystemToken interface {
	Execute(authorizationToken string, workspaceID string, authorization domain.Authorization) error
}

type authorizeSystemToken struct {
	enforcer              service.SecurityFilterService
	systemTokenRepository repository.SystemTokenRepository
	permissionRepository  repository.PermissionRepository
	workspaceRepository   repository.WorkspaceRepository
}

func NewAuthorizeSystemToken(enforcer service.SecurityFilterService,
	systemTokenRepository repository.SystemTokenRepository,
	permissionRepository repository.PermissionRepository,
	workspaceRepository repository.WorkspaceRepository,
) AuthorizeSystemToken {
	return authorizeSystemToken{
		enforcer:              enforcer,
		systemTokenRepository: systemTokenRepository,
		permissionRepository:  permissionRepository,
		workspaceRepository:   workspaceRepository,
	}
}

func (authorizeSystemToken authorizeSystemToken) Execute(authorizationToken string, workspaceID string, authorization domain.Authorization) error {
	allowed, err := authorizeSystemToken.enforcer.Authorize("public", authorization.Path, authorization.Method)
	if err != nil {
		return logging.NewError("Forbidden", err, logging.InternalError, nil, "authorize.systemToken")
	}

	systemToken, err := authorizeSystemToken.systemTokenRepository.FindByToken(authorizationToken)
	if err != nil {
		return logging.WithOperation(err, "authorize.systemToken")
	}

	if allowed {
		systemToken.SetLastUsed()
		err := authorizeSystemToken.systemTokenRepository.UpdateLastUsedAt(systemToken)
		if err != nil {
			return logging.WithOperation(err, "authorize.systemToken")
		}
		return nil
	}

	if systemToken.Revoked {
		return logging.NewError("Forbidden", errors.New("forbidden"), logging.ForbiddenError, nil, "authorize.systemToken")
	}

	if !systemToken.AllWorkspaces {
		workspaces, err := authorizeSystemToken.workspaceRepository.FindBySystemTokenID(systemToken.ID.String())
		if err != nil {
			return logging.WithOperation(err, "authorize.systemToken")
		}

		if !contains(workspaces, workspaceID) {
			return logging.NewError("Forbidden", errors.New("forbidden"), logging.ForbiddenError, nil, "authorize.systemToken")
		}
	}

	permissions, err := authorizeSystemToken.permissionRepository.FindBySystemTokenID(systemToken.ID.String())
	if err != nil {
		return logging.WithOperation(err, "authorize.systemToken")
	}

	for _, p := range permissions {
		allowed, err = authorizeSystemToken.enforcer.Authorize(p.Name, authorization.Path, authorization.Method)
		if err != nil {
			return logging.NewError("Forbidden", err, logging.InternalError, nil, "authorize.systemToken")
		}

		if allowed {
			systemToken.SetLastUsed()
			err := authorizeSystemToken.systemTokenRepository.UpdateLastUsedAt(systemToken)
			if err != nil {
				return logging.NewError(err.Error(), err, logging.InternalError, nil, "authorize.systemToken")
			}
			return nil
		}
	}
	return logging.NewError("Forbidden", errors.New("forbidden"), logging.ForbiddenError, nil, "authorize.systemToken")
}

func contains(s []domain.SimpleWorkspace, e string) bool {
	for _, a := range s {
		if a.ID.String() == e {
			return true
		}
	}
	return false
}
