package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/stretchr/testify/require"
)

func (st *SystemTokenSuite) TestGetAll() {
	st.systemTokenRepository.On("FindAll", getDummyPage()).Return(
		[]domain.SystemToken{getDummySystemToken(), getDummySystemToken()},
		getDummyPage(),
		nil)

	stList, _, err := st.getAllSystemToken.Execute(getDummyPage())

	require.NotNil(st.T(), stList)
	require.Nil(st.T(), err)
	require.NotEmpty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", getDummyPage()))
}

func (st *SystemTokenSuite) TestErrorGetAllInternalError() {
	st.systemTokenRepository.On("FindAll", getDummyPage()).Return(
		[]domain.SystemToken{},
		getDummyPage(),
		logging.NewError("Internal error", logging.CustomError{}, logging.InternalError, nil))

	stList, _, err := st.getAllSystemToken.Execute(getDummyPage())

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))
	require.Empty(st.T(), stList)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindAll", getDummyPage()))
}

func getDummyPage() domain.Page {
	return domain.Page{
		PageNumber: 0,
		PageSize:   20,
		Sort:       "sort",
		Total:      20,
	}
}
