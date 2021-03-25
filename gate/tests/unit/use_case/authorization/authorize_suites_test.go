package main

import (
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
	mocks "github.com/ZupIT/charlescd/gate/tests/unit/mocks/repository"
	"github.com/stretchr/testify/suite"
	"testing"
)

type AuthorizeSuite struct {
	suite.Suite
	authorizeUserToken  authorization.DoAuthorization
	enforcer            service.SecurityFilterService
	workspaceRepository *mocks.WorkspaceRepository
	userRepository      *mocks.UserRepository
	authTokenService    service.AuthTokenService
}

func (as *AuthorizeSuite) SetupSuite() {
	as.authorizeUserToken = authorization.NewDoAuthorization(as.enforcer, as.userRepository, as.workspaceRepository, as.authTokenService)
	as.workspaceRepository = new(mocks.WorkspaceRepository)
	as.authTokenService = service.NewAuthTokenService()
	as.enforcer = service.NewSecurityFilterService()
	as.userRepository = new(mocks.UserRepository)
}

func (as *AuthorizeSuite) SetupTest() {
	as.SetupSuite()
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(AuthorizeSuite))
}
