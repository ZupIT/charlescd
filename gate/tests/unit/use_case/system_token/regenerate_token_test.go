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
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func (st *SystemTokenSuite) TestRegenerateSystemToken() {
	systemToken := utils.GetDummySystemToken()

	st.systemTokenRepository.On("FindByID", systemToken.ID).Return(systemToken, nil).Once()
	st.systemTokenRepository.On("Update", mock.AnythingOfType("domain.SystemToken")).Return(nil).Once()

	result, err := st.regenerateSystemToken.Execute(systemToken.ID)

	require.Nil(st.T(), err)

	require.Equal(st.T(), 2, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindByID", systemToken.ID))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "Update", mock.AnythingOfType("domain.SystemToken")))

	require.NotNil(st.T(), result)
	require.NotEqual(st.T(), result, systemToken.Token)
}

func (st *SystemTokenSuite) TestRegenerateSystemTokenIDNotFound() {
	id := uuid.New()
	st.systemTokenRepository.On("FindByID", id).
		Return(domain.SystemToken{}, logging.NewError("Not found error", logging.CustomError{}, logging.NotFoundError, nil)).Once()

	response, err := st.regenerateSystemToken.Execute(id)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.NotFoundError, logging.GetErrorType(err))

	require.Equal(st.T(), 1, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindByID", id))
	require.Equal(st.T(), response, "")
}

func (st *SystemTokenSuite) TestRegenerateSystemTokenErrorWhenUpdating() {
	systemToken := utils.GetDummySystemToken()

	st.systemTokenRepository.On("FindByID", systemToken.ID).Return(systemToken, nil).Once()
	st.systemTokenRepository.On("Update", mock.AnythingOfType("domain.SystemToken")).
		Return(logging.NewError("Update system token failed", logging.CustomError{}, logging.InternalError, nil)).Once()

	response, err := st.regenerateSystemToken.Execute(systemToken.ID)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))

	require.Equal(st.T(), 2, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindByID", systemToken.ID))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "Update", mock.AnythingOfType("domain.SystemToken")))
	require.Equal(st.T(), response, "")
}

func (st *SystemTokenSuite) TestRegenerateSystemTokenIfTokenIsAlreadyRevoked() {
	systemToken := utils.GetDummySystemToken()
	systemToken.Revoked = true

	st.systemTokenRepository.On("FindByID", systemToken.ID).Return(systemToken, nil).Once()

	response, err := st.regenerateSystemToken.Execute(systemToken.ID)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.BusinessError, logging.GetErrorType(err))

	require.Equal(st.T(), 1, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindByID", systemToken.ID))
	require.Equal(st.T(), response, "")
}
