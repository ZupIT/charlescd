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
	"github.com/ZupIT/charlescd/gate/internal/service"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	repositoryMocks "github.com/ZupIT/charlescd/gate/tests/unit/mocks/repository"
	"github.com/stretchr/testify/suite"
	"testing"
)

type SystemTokenSuite struct {
	suite.Suite
	createSystemToken     systemTokenInteractor.CreateSystemToken
	getSystemToken        systemTokenInteractor.GetSystemToken
	getAllSystemToken     systemTokenInteractor.GetAllSystemToken
	revokeSystemToken     systemTokenInteractor.RevokeSystemToken
	systemTokenRepository *repositoryMocks.SystemTokenRepository
	permissionRepository  *repositoryMocks.PermissionRepository
	userRepository        *repositoryMocks.UserRepository
	workspaceRepository   *repositoryMocks.WorkspaceRepository
	authTokenService      service.AuthTokenService
}

func (st *SystemTokenSuite) SetupSuite() {
	st.systemTokenRepository = new(repositoryMocks.SystemTokenRepository)
	st.permissionRepository = new(repositoryMocks.PermissionRepository)
	st.userRepository = new(repositoryMocks.UserRepository)
	st.workspaceRepository = new(repositoryMocks.WorkspaceRepository)
	st.authTokenService = service.NewAuthTokenService()
	st.createSystemToken = systemTokenInteractor.NewCreateSystemToken(st.systemTokenRepository, st.permissionRepository, st.userRepository, st.workspaceRepository, st.authTokenService)
	st.getSystemToken = systemTokenInteractor.NewGetSystemToken(st.systemTokenRepository)
	st.getAllSystemToken = systemTokenInteractor.NewGetAllSystemToken(st.systemTokenRepository)
	st.revokeSystemToken = systemTokenInteractor.NewRevokeSystemToken(st.systemTokenRepository)
}

func (st *SystemTokenSuite) SetupTest() {
	st.SetupSuite()
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(SystemTokenSuite))
}

