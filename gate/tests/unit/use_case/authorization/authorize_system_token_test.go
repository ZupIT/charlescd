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

package main

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/stretchr/testify/require"
)

func (as *AuthorizeSuite) TestAuthorizeSystemTokenPublicPath() {
	var path = "/actuator/health"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithoutWorkspacePermission() {
	var path = "/v2/circles"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()
	as.workspaceRepository.On("FindWorkspacesBySystemTokenId", systemToken.ID.String()).Return(systemToken.Workspaces, nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeNotFoundSystemToken() {
	var path = "/v2/circles"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(domain.SystemToken{}, logging.NewError("Token not found", logging.CustomError{}, logging.NotFoundError, nil, "unit.GetById.First")).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.NotFoundError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithPermissionToWorkspace() {
	var path = "/v2/circles"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()
	var workspaces = utils.GetDummySimpleWorkspaces()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()
	as.workspaceRepository.On("FindWorkspacesBySystemTokenId", systemToken.ID.String()).Return(workspaces, nil).Once()
	as.permissionRepository.On("FindPermissionsBySystemTokenId", systemToken.ID.String()).Return(utils.GetDummyPermissions(), nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, workspaces[0].ID.String(), utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithoutPermissionToWorkspace() {
	var path = "/v2/webhook/publish"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindByToken", systemToken.Token).Return(systemToken, nil).Once()
	as.workspaceRepository.On("FindWorkspacesBySystemTokenId", systemToken.ID.String()).Return(systemToken.Workspaces, nil).Once()
	as.permissionRepository.On("FindPermissionsBySystemTokenId", systemToken.ID.String()).Return(utils.GetDummyPermissions(), nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.Token, "workspace-id", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}
