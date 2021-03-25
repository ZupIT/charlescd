package main

import (
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/stretchr/testify/require"
)

func (as *AuthorizeSuite) TestAuthorizeUserToken() {
	var path = "/actuator/health"
	var method = "GET"

	err := as.authorizeUserToken.Execute(utils.GetDummyAuthorization(), "workspaceId", utils.GetDummyAuthorizationInput(path, method))

	require.Nil(as.T(), err)
}
