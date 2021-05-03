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
	"testing"

	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
	"github.com/ZupIT/charlescd/gate/tests/unit/mocks"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/suite"
)

type AuthorizeSuite struct {
	suite.Suite
	authorizeUserToken    authorization.AuthorizeUserToken
	authorizeSystemToken  authorization.AuthorizeSystemToken
	securityFilterService service.SecurityFilterService
	workspaceRepository   *mocks.WorkspaceRepository
	userRepository        *mocks.UserRepository
	authTokenService      service.AuthTokenService
	systemTokenRepository *mocks.SystemTokenRepository
	permissionRepository  *mocks.PermissionRepository
}

func (as *AuthorizeSuite) SetupSuite() {
	as.userRepository = new(mocks.UserRepository)
	as.systemTokenRepository = new(mocks.SystemTokenRepository)
	as.permissionRepository = new(mocks.PermissionRepository)
	as.workspaceRepository = new(mocks.WorkspaceRepository)
	as.authorizeSystemToken = authorization.NewAuthorizeSystemToken(as.securityFilterService, as.systemTokenRepository, as.permissionRepository, as.workspaceRepository)
	as.authorizeUserToken = authorization.NewAuthorizeUserToken(as.securityFilterService, as.userRepository, as.workspaceRepository, as.authTokenService)
	as.authTokenService = service.NewAuthTokenService()
	as.securityFilterService, _ = service.NewSecurityFilterService()
}

func (as *AuthorizeSuite) SetupTest() {
	as.SetupSuite()
}

func TestSuite(t *testing.T) {
	godotenv.Load("../../../.env.tests")
	suite.Run(t, new(AuthorizeSuite))
}
