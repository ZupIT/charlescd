package main

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/stretchr/testify/require"
)

func (as *AuthorizeSuite) TestAuthorizeUserTokenPublicPath() {
	var path = "/actuator/health"
	var method = "GET"

	err := as.authorizeUserToken.Execute(utils.GetDummyRootAuthorization(), "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeUserTokenManagementPath() {
	var path = "/v2/users"
	var method = "GET"

	err := as.authorizeUserToken.Execute(utils.GetDummyRootAuthorization(), "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeEmptyUserToken() {
	var path = "/v2/users"
	var method = "GET"

	err := as.authorizeUserToken.Execute("", "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeRootUserTokenClosedPath() {
	var path = "/v2/workspaces/users"
	var method = "GET"
	var user = utils.GetDummyRootUser()

	as.userRepository.On("GetByEmail", user.Email).Return(user, nil).Once()

	err := as.authorizeUserToken.Execute(utils.GetDummyRootAuthorization(), "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeNonRootUserTokenClosedPathWithoutPermissions() {
	var path = "/v2/workspaces/users"
	var method = "GET"
	var user = utils.GetDummyUser()
	var permissions = [][]domain.Permission{ utils.GetDummyPermissions() }

	as.userRepository.On("GetByEmail", user.Email).Return(user, nil).Once()
	as.workspaceRepository.On("GetUserPermissionAtWorkspace", "workspaceId", user.ID.String()).Return(permissions, nil).Once()

	err := as.authorizeUserToken.Execute(utils.GetDummyAuthorization(), "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.ForbiddenError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeNonRootUserTokenClosedPathWithPermissions() {
	var path = "/v2/circles/"
	var method = "POST"
	var user = utils.GetDummyUser()
	var permissions = [][]domain.Permission{ utils.GetDummyPermissions() }

	as.userRepository.On("GetByEmail", user.Email).Return(user, nil).Once()
	as.workspaceRepository.On("GetUserPermissionAtWorkspace", "workspaceId", user.ID.String()).Return(permissions, nil).Once()

	err := as.authorizeUserToken.Execute(utils.GetDummyAuthorization(), "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Nil(as.T(), err)
}

func (as *AuthorizeSuite) TestAuthorizeNotFoundUser() {
	var path = "/v2/workspaces/users"
	var method = "GET"
	var user = utils.GetDummyRootUser()

	as.userRepository.On("GetByEmail", user.Email).Return(domain.User{}, logging.NewError("User not found", logging.CustomError{}, logging.NotFoundError, nil, "unit.GetByEmail.First")).Once()

	err := as.authorizeUserToken.Execute(utils.GetDummyRootAuthorization(), "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.NotFoundError, logging.GetErrorType(err))
}

func (as *AuthorizeSuite) TestAuthorizeInvalidToken() {
	var path = "/v2/workspaces/users"
	var method = "GET"
	var user = utils.GetDummyRootUser()

	as.userRepository.On("GetByEmail", user.Email).Return(domain.User{}, logging.NewError("User not found", logging.CustomError{}, logging.NotFoundError, nil, "unit.GetByEmail.First")).Once()

	err := as.authorizeUserToken.Execute("Bearer invalid.auth.token", "workspaceId", utils.GetDummyAuthorizationAuthorization(path, method))

	require.Error(as.T(), err)
	require.Equal(as.T(), logging.InternalError, logging.GetErrorType(err))
}
