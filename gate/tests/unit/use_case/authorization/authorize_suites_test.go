package main

import (
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
	"github.com/ZupIT/charlescd/gate/tests/unit/mocks"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/suite"
	"testing"
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
}

func (as *AuthorizeSuite) SetupSuite() {
	as.userRepository = new(mocks.UserRepository)
	as.systemTokenRepository = new(mocks.SystemTokenRepository)
	as.workspaceRepository = new(mocks.WorkspaceRepository)
	as.authorizeSystemToken = authorization.NewAuthorizeSystemToken(as.securityFilterService, as.systemTokenRepository)
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
