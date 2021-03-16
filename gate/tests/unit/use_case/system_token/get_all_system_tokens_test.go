package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/tests/unit/utils"
	"github.com/stretchr/testify/require"
)

func (st *SystemTokenSuite) TestGetAll() {
	st.systemTokenRepository.On("FindAll", utils.GetDummyPage()).Return(
		[]domain.SystemToken{utils.GetDummySystemToken(), utils.GetDummySystemToken()},
		utils.GetDummyPage(),
		nil)

	stList, _, err := st.getAllSystemToken.Execute(utils.GetDummyPage())

	require.NotNil(st.T(), stList)
	require.Nil(st.T(), err)
	require.NotEmpty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", utils.GetDummyPage()))
}

func (st *SystemTokenSuite) TestGetAllEmpty() {
	st.systemTokenRepository.On("FindAll", utils.GetDummyPage()).Return(
		[]domain.SystemToken{},
		utils.GetDummyPage(),
		nil)

	stList, _, err := st.getAllSystemToken.Execute(utils.GetDummyPage())

	require.NotNil(st.T(), stList)
	require.Nil(st.T(), err)
	require.Empty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", utils.GetDummyPage()))
}

func (st *SystemTokenSuite) TestErrorGetAllInternalError() {
	st.systemTokenRepository.On("FindAll", utils.GetDummyPage()).Return(
		[]domain.SystemToken{},
		utils.GetDummyPage(),
		logging.NewError("Internal error", logging.CustomError{}, logging.InternalError, nil))

	stList, _, err := st.getAllSystemToken.Execute(utils.GetDummyPage())

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))
	require.Empty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", utils.GetDummyPage()))
}
