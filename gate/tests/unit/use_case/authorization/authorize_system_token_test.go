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

package main

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func (as *AuthorizeSuite) TestAuthorizeSystemTokenPublicPath() {
	var path = "/moove/actuator/health"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()
	as.systemTokenRepository.On("UpdateLastUsedAt", mock.AnythingOfType("domain.SystemToken")).Return(nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
	require.Equal(as.T(), 2, len(as.systemTokenRepository.ExpectedCalls))
	require.Equal(as.T(), 0, len(as.workspaceRepository.ExpectedCalls))
	require.Equal(as.T(), 0, len(as.permissionRepository.ExpectedCalls))
	require.True(as.T(), as.systemTokenRepository.AssertCalled(as.T(), "UpdateLastUsedAt", mock.AnythingOfType("domain.SystemToken")))
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithoutWorkspacePermission() {
	var path = "/moove/v2/circles"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()
	as.workspaceRepository.On("FindBySystemTokenID", systemToken.ID.String()).Return(systemToken.Workspaces, nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
	require.Equal(as.T(), 1, len(as.systemTokenRepository.ExpectedCalls))
	require.Equal(as.T(), 1, len(as.workspaceRepository.ExpectedCalls))
	require.Equal(as.T(), 0, len(as.permissionRepository.ExpectedCalls))
}

func (as *AuthorizeSuite) TestAuthorizeNotFoundSystemToken() {
	var path = "/moove/v2/circles"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(domain.SystemToken{}, logging.NewError("Token not found", logging.CustomError{}, logging.NotFoundError, nil, "unit.GetById.First")).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.NotFoundError, logging.GetErrorType(err))
	require.Equal(as.T(), 1, len(as.systemTokenRepository.ExpectedCalls))
	require.Equal(as.T(), 0, len(as.workspaceRepository.ExpectedCalls))
	require.Equal(as.T(), 0, len(as.permissionRepository.ExpectedCalls))
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithPermissionToWorkspace() {
	var path = "/moove/v2/circles"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()
	var workspaces = utils.GetDummySimpleWorkspaces()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()
	as.workspaceRepository.On("FindBySystemTokenID", systemToken.ID.String()).Return(workspaces, nil).Once()
	as.permissionRepository.On("FindBySystemTokenID", systemToken.ID.String()).Return(utils.GetDummyPermissions(), nil).Once()
	as.systemTokenRepository.On("UpdateLastUsedAt", mock.AnythingOfType("domain.SystemToken")).Return(nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, workspaces[0].ID.String(), utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
	require.Equal(as.T(), 2, len(as.systemTokenRepository.ExpectedCalls))
	require.Equal(as.T(), 1, len(as.workspaceRepository.ExpectedCalls))
	require.Equal(as.T(), 1, len(as.permissionRepository.ExpectedCalls))
	require.True(as.T(), as.systemTokenRepository.AssertCalled(as.T(), "UpdateLastUsedAt", mock.AnythingOfType("domain.SystemToken")))
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathSystemTokenRevoked() {
	var path = "/moove/v2/circles"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()
	systemToken.Revoked = true
	systemToken.AllWorkspaces = true

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithoutPermissionToWorkspace() {
	var path = "/moove/v2/webhook/publish"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()
	as.workspaceRepository.On("FindBySystemTokenID", systemToken.ID.String()).Return(systemToken.Workspaces, nil).Once()
	as.permissionRepository.On("FindBySystemTokenID", systemToken.ID.String()).Return(utils.GetDummyPermissions(), nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspace-id", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), 1, len(as.systemTokenRepository.ExpectedCalls))
	require.Equal(as.T(), 1, len(as.workspaceRepository.ExpectedCalls))
	require.Equal(as.T(), 1, len(as.permissionRepository.ExpectedCalls))
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}
