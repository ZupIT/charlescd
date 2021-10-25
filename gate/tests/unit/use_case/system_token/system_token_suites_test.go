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
	"github.com/ZupIT/charlescd/gate/internal/service"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/systoken"
	"github.com/ZupIT/charlescd/gate/tests/unit/mocks"
	"github.com/stretchr/testify/suite"
	"testing"
)

type SystemTokenSuite struct {
	suite.Suite
	createSystemToken     systemTokenInteractor.CreateSystemToken
	getAllSystemToken     systemTokenInteractor.GetAllSystemToken
	getSystemToken        systemTokenInteractor.GetSystemToken
	regenerateSystemToken systemTokenInteractor.RegenerateSystemToken
	revokeSystemToken     systemTokenInteractor.RevokeSystemToken
	systemTokenRepository *mocks.SystemTokenRepository
	permissionRepository  *mocks.PermissionRepository
	userRepository        *mocks.UserRepository
	workspaceRepository   *mocks.WorkspaceRepository
	authTokenService      service.AuthTokenService
}

func (st *SystemTokenSuite) SetupSuite() {
	st.systemTokenRepository = new(mocks.SystemTokenRepository)
	st.permissionRepository = new(mocks.PermissionRepository)
	st.userRepository = new(mocks.UserRepository)
	st.workspaceRepository = new(mocks.WorkspaceRepository)
	st.authTokenService = service.NewAuthTokenService()
	st.createSystemToken = systemTokenInteractor.NewCreateSystemToken(st.systemTokenRepository, st.permissionRepository, st.userRepository, st.workspaceRepository, st.authTokenService)
	st.getAllSystemToken = systemTokenInteractor.NewGetAllSystemToken(st.systemTokenRepository)
	st.getSystemToken = systemTokenInteractor.NewGetSystemToken(st.systemTokenRepository)
	st.regenerateSystemToken = systemTokenInteractor.NewRegenerateSystemToken(st.systemTokenRepository)
	st.revokeSystemToken = systemTokenInteractor.NewRevokeSystemToken(st.systemTokenRepository)
}

func (st *SystemTokenSuite) SetupTest() {
	st.SetupSuite()
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(SystemTokenSuite))
}
