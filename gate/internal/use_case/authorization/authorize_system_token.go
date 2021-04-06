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

package authorization

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/google/uuid"
)

type AuthorizeSystemToken interface {
	Execute(authorizationToken string, workspaceId string, authorization domain.Authorization) error
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

func (authorizeSystemToken authorizeSystemToken) Execute(authorizationToken string, workspaceId string, authorization domain.Authorization) error {
	allowed, err := authorizeSystemToken.enforcer.Authorize("public", authorization.Path, authorization.Method)
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
		allowed, err = authorizeSystemToken.enforcer.Authorize(st.Name, authorization.Path, authorization.Method)
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
