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

	err := as.authorizeSystemToken.Execute(systemToken.ID.String(), "workspaceId", utils.GetDummyAuthorizationInput(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithoutWorkspacePermission() {
	var path = "/v2/circles/"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindById", systemToken.ID).Return(systemToken, nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.ID.String(), "workspaceId", utils.GetDummyAuthorizationInput(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeNotFoundSystemToken() {
	var path = "/v2/circles/"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindById", systemToken.ID).Return(domain.SystemToken{}, logging.NewError("Token not found", logging.CustomError{}, logging.NotFoundError, nil, "unit.GetById.First")).Once()

	err := as.authorizeSystemToken.Execute(systemToken.ID.String(), "workspaceId", utils.GetDummyAuthorizationInput(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.NotFoundError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithPermissionToWorkspace() {
	var path = "/v2/circles/"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindById", systemToken.ID).Return(systemToken, nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.ID.String(), "workspace-id", utils.GetDummyAuthorizationInput(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeSystemTokenClosedPathWithoutPermissionToWorkspace() {
	var path = "/v2/webhook/publish"
	var method = "GET"
	var systemToken = utils.GetDummySystemToken()

	as.systemTokenRepository.On("FindById", systemToken.ID).Return(systemToken, nil).Once()

	err := as.authorizeSystemToken.Execute(systemToken.ID.String(), "workspace-id", utils.GetDummyAuthorizationInput(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}


