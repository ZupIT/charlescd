package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

func (st *SystemTokenSuite) TestGetAll() {
	st.systemTokenRepository.On("FindAll", domain.Page{}).Return(
		[]domain.SystemToken{{ID: uuid.New()}, {ID: uuid.New()}},
		domain.Page{},
		nil)
	stList, _, err := st.getAllSystemToken.Execute(domain.Page{})
	require.NotNil(st.T(), stList)
	require.Nil(st.T(), err)
}

func (st *SystemTokenSuite) TestErrorGetAllInternalError() {
	st.systemTokenRepository.On("FindAll", domain.Page{}).Return(
		[]domain.SystemToken{},
		domain.Page{},
		logging.NewError("Internal error", logging.CustomError{}, logging.InternalError, nil))
	_, _, err := st.getAllSystemToken.Execute(domain.Page{})
	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))
}
