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

package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func (st *SystemTokenSuite) TestCreateSystemToken() {
	systemToken := utils.GetDummySystemToken()
	authorization := utils.GetDummyRootAuthorization()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()
	permissions := utils.GetDummyPermissions()
	workspaces := utils.GetDummySimpleWorkspaces()
	user := utils.GetDummyUserSystemToken(systemToken.ID)

	systemToken.Permissions = permissions
	systemToken.Workspaces = workspaces
	systemToken.Author = authToken.Email

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(true, nil).Once()
	st.permissionRepository.On("FindAll", systemTokenInput.Permissions).Return(permissions, nil).Once()
	st.workspaceRepository.On("FindByIds", systemTokenInput.Workspaces).Return(workspaces, nil).Once()
	st.systemTokenRepository.On("Create", mock.AnythingOfType("domain.SystemToken")).Return(systemToken, nil).Once()
	st.userRepository.On("Create", mock.AnythingOfType("domain.User")).Return(user, nil).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.NotNil(st.T(), result)
	require.Nil(st.T(), err)

	require.Equal(st.T(), 2, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@admin"))
	require.True(st.T(), st.permissionRepository.AssertCalled(st.T(), "FindAll", systemTokenInput.Permissions))
	require.True(st.T(), st.workspaceRepository.AssertCalled(st.T(), "FindByIds", systemTokenInput.Workspaces))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "Create", mock.AnythingOfType("domain.SystemToken")))
	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "Create", mock.AnythingOfType("domain.User")))

	createdSystemToken := st.systemTokenRepository.Calls[0].Parent.Calls[0].Arguments.Get(0).(domain.SystemToken)
	require.NotNil(st.T(), createdSystemToken)
	require.Equal(st.T(), systemToken.Name, createdSystemToken.Name)
	require.Equal(st.T(), systemToken.Revoked, createdSystemToken.Revoked)
	require.Equal(st.T(), systemToken.Permissions, createdSystemToken.Permissions)
	require.Equal(st.T(), systemToken.Workspaces, createdSystemToken.Workspaces)
	require.Equal(st.T(), systemToken.RevokedAt, createdSystemToken.RevokedAt)
	require.Equal(st.T(), systemToken.LastUsedAt, createdSystemToken.LastUsedAt)
	require.Equal(st.T(), systemToken.Author, createdSystemToken.Author)
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithEmptyAuthorization() {
	authorization := ""
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))

	require.Equal(st.T(), 0, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithInvalidAuthorization() {
	authorization := "Bearer invalid authorization header"
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))

	require.Equal(st.T(), 0, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithUserRepositoryError() {
	authorization := utils.GetDummyAuthorizationNotFound()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()

	authToken.Email = "charlesadmin@notfound"

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(false, logging.NewError("Find user by email failed", logging.CustomError{}, logging.InternalError, nil, "repository.UserRepository.FindByEmail")).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))

	require.Equal(st.T(), 1, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@notfound"))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithUserNotFound() {
	authorization := utils.GetDummyAuthorizationNotFound()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()

	authToken.Email = "charlesadmin@notfound"

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(false, nil).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), logging.BusinessError, logging.GetErrorType(err))
	require.Equal(st.T(), "user not found", err.Error())

	require.Equal(st.T(), 1, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@notfound"))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithPermissionRepositoryError() {
	authorization := utils.GetDummyRootAuthorization()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(true, nil).Once()
	st.permissionRepository.On("FindAll", systemTokenInput.Permissions).Return([]domain.Permission{}, logging.NewError("Find all permissions failed", logging.CustomError{}, logging.InternalError, nil, "repository.FindAll.Find")).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))

	require.Equal(st.T(), 1, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@admin"))
	require.True(st.T(), st.permissionRepository.AssertCalled(st.T(), "FindAll", systemTokenInput.Permissions))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithPermissionsNotFound() {
	authorization := utils.GetDummyRootAuthorization()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(true, nil).Once()
	st.permissionRepository.On("FindAll", systemTokenInput.Permissions).Return([]domain.Permission{}, nil).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), "invalid permissions", err.Error())

	require.Equal(st.T(), 1, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@admin"))
	require.True(st.T(), st.permissionRepository.AssertCalled(st.T(), "FindAll", systemTokenInput.Permissions))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithWorkspaceRepositoryError() {
	systemToken := utils.GetDummySystemToken()
	authorization := utils.GetDummyRootAuthorization()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()
	permissions := utils.GetDummyPermissions()
	workspaces := utils.GetDummySimpleWorkspaces()

	systemToken.Permissions = permissions
	systemToken.Workspaces = workspaces
	systemToken.Author = authToken.Email

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(true, nil).Once()
	st.permissionRepository.On("FindAll", systemTokenInput.Permissions).Return(permissions, nil).Once()
	st.workspaceRepository.On("FindByIds", systemTokenInput.Workspaces).Return([]domain.SimpleWorkspace{}, logging.NewError("Find all workspaces failed", logging.CustomError{}, logging.InternalError, nil, "repository.FindByIds.Count")).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))

	require.Equal(st.T(), 1, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@admin"))
	require.True(st.T(), st.permissionRepository.AssertCalled(st.T(), "FindAll", systemTokenInput.Permissions))
	require.True(st.T(), st.workspaceRepository.AssertCalled(st.T(), "FindByIds", systemTokenInput.Workspaces))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithWorkspaceNotFound() {
	systemToken := utils.GetDummySystemToken()
	authorization := utils.GetDummyRootAuthorization()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()
	permissions := utils.GetDummyPermissions()
	workspaces := utils.GetDummySimpleWorkspaces()

	systemToken.Permissions = permissions
	systemToken.Workspaces = workspaces
	systemToken.Author = authToken.Email

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(true, nil).Once()
	st.permissionRepository.On("FindAll", systemTokenInput.Permissions).Return(permissions, nil).Once()
	st.workspaceRepository.On("FindByIds", systemTokenInput.Workspaces).Return([]domain.SimpleWorkspace{}, nil).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), "workspaces were not found", err.Error())

	require.Equal(st.T(), 1, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 0, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@admin"))
	require.True(st.T(), st.permissionRepository.AssertCalled(st.T(), "FindAll", systemTokenInput.Permissions))
	require.True(st.T(), st.workspaceRepository.AssertCalled(st.T(), "FindByIds", systemTokenInput.Workspaces))
}

func (st *SystemTokenSuite) TestCreateSystemTokenWithSystemTokenRepositoryError() {
	authorization := utils.GetDummyRootAuthorization()
	authToken := utils.GetDummyAuthToken()
	systemTokenInput := utils.GetDummyCreateSystemTokenInput()
	permissions := utils.GetDummyPermissions()
	workspaces := utils.GetDummySimpleWorkspaces()

	st.userRepository.On("ExistsByEmail", authToken.Email).Return(true, nil).Once()
	st.permissionRepository.On("FindAll", systemTokenInput.Permissions).Return(permissions, nil).Once()
	st.workspaceRepository.On("FindByIds", systemTokenInput.Workspaces).Return(workspaces, nil).Once()
	st.systemTokenRepository.On("Create", mock.AnythingOfType("domain.SystemToken")).Return(domain.SystemToken{}, logging.NewError("Save system token failed", logging.CustomError{}, logging.InternalError, nil, "unit.Create.Save")).Once()

	result, err := st.createSystemToken.Execute(authorization, systemTokenInput)

	require.Zero(st.T(), result)
	require.NotNil(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))

	require.Equal(st.T(), 1, len(st.userRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.permissionRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.workspaceRepository.ExpectedCalls))
	require.Equal(st.T(), 1, len(st.systemTokenRepository.ExpectedCalls))

	require.True(st.T(), st.userRepository.AssertCalled(st.T(), "ExistsByEmail", "charlesadmin@admin"))
	require.True(st.T(), st.permissionRepository.AssertCalled(st.T(), "FindAll", systemTokenInput.Permissions))
	require.True(st.T(), st.workspaceRepository.AssertCalled(st.T(), "FindByIds", systemTokenInput.Workspaces))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "Create", mock.AnythingOfType("domain.SystemToken")))
}
