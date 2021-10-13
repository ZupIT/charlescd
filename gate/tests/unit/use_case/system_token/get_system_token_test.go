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
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

func (st *SystemTokenSuite) TestGetByID() {
	systemToken := utils.GetDummySystemToken()

	st.systemTokenRepository.On("FindByID", systemToken.ID).Return(systemToken, nil)
	result, err := st.getSystemToken.Execute(systemToken.ID)

	require.NotNil(st.T(), result)
	require.Nil(st.T(), err)
	require.Equal(st.T(), result.ID, systemToken.ID)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindByID", systemToken.ID))
}

func (st *SystemTokenSuite) TestErrorGetByIDNotFound() {
	systemToken := utils.GetDummySystemToken()

	st.systemTokenRepository.On("FindByID", systemToken.ID).
		Return(systemToken, logging.NewError("Not found error", logging.CustomError{}, logging.NotFoundError, nil))
	result, err := st.getSystemToken.Execute(systemToken.ID)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.NotFoundError, logging.GetErrorType(err))
	require.Equal(st.T(), result.ID, uuid.Nil)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindByID", systemToken.ID))

}

func (st *SystemTokenSuite) TestErrorGetByIDInternalError() {
	systemToken := utils.GetDummySystemToken()

	st.systemTokenRepository.On("FindByID", systemToken.ID).
		Return(systemToken, logging.NewError("Internal error", logging.CustomError{}, logging.InternalError, nil))
	result, err := st.getSystemToken.Execute(systemToken.ID)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))
	require.Equal(st.T(), result.ID, uuid.Nil)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindByID", systemToken.ID))
}
