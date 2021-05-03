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
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/stretchr/testify/require"
)

func (st *SystemTokenSuite) TestGetAll() {
	name := ""

	st.systemTokenRepository.On("FindAll", name, utils.GetDummyPage()).Return(
		[]domain.SystemToken{utils.GetDummySystemToken(), utils.GetDummySystemToken()},
		utils.GetDummyPage(),
		nil)

	stList, _, err := st.getAllSystemToken.Execute(name, utils.GetDummyPage())

	require.NotNil(st.T(), stList)
	require.Nil(st.T(), err)
	require.NotEmpty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", name, utils.GetDummyPage()))
}

func (st *SystemTokenSuite) TestGetAllEmpty() {
	name := ""

	st.systemTokenRepository.On("FindAll", name, utils.GetDummyPage()).Return(
		[]domain.SystemToken{},
		utils.GetDummyPage(),
		nil)

	stList, _, err := st.getAllSystemToken.Execute(name, utils.GetDummyPage())

	require.NotNil(st.T(), stList)
	require.Nil(st.T(), err)
	require.Empty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", name, utils.GetDummyPage()))
}

func (st *SystemTokenSuite) TestErrorGetAllInternalError() {
	name := ""

	st.systemTokenRepository.On("FindAll", name, utils.GetDummyPage()).Return(
		[]domain.SystemToken{},
		utils.GetDummyPage(),
		logging.NewError("Internal error", logging.CustomError{}, logging.InternalError, nil))

	stList, _, err := st.getAllSystemToken.Execute(name, utils.GetDummyPage())

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))
	require.Empty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", name, utils.GetDummyPage()))
}
