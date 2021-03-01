package unit

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	mocks "github.com/ZupIT/charlescd/gate/tests/unit/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type SystemTokenSuite struct {
	suite.Suite
	getSystemToken systemTokenInteractor.GetSystemToken
	getAllSystemToken systemTokenInteractor.GetAllSystemToken
	systemTokenRepository      *mocks.SystemTokenRepository
}

func (st *SystemTokenSuite) SetupSuite() {
	st.systemTokenRepository = new(mocks.SystemTokenRepository)
	st.getSystemToken = systemTokenInteractor.NewGetSystemToken(st.systemTokenRepository)
	st.getAllSystemToken = systemTokenInteractor.NewGetAllSystemToken(st.systemTokenRepository)
}

func (st *SystemTokenSuite) SetupTest() {
	st.SetupSuite()
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(SystemTokenSuite))
}

func (st *SystemTokenSuite) TestGetByID() {
	st.systemTokenRepository.On("FindById", mock.Anything).Return(domain.SystemToken{ID: uuid.New()}, nil)
	a, err := st.getSystemToken.Execute(uuid.New())
	require.NotNil(st.T(), a)
	require.Nil(st.T(), err)
}

func (st *SystemTokenSuite) TestErrorGetByIDNotFound() {
	st.systemTokenRepository.On("FindById", mock.Anything).Return(domain.SystemToken{}, logging.NewError("Not found error", logging.CustomError{} ,  logging.NotFoundError, nil))
	_, err := st.getSystemToken.Execute(uuid.New())
	require.Error(st.T(), err)
	require.Equal(st.T(), logging.NotFoundError, logging.GetErrorType(err))


}

func (st *SystemTokenSuite) TestErrorGetByIDInternalError() {
	st.systemTokenRepository.On("FindById", mock.Anything).Return(domain.SystemToken{}, logging.NewError("Internal error", logging.CustomError{}, logging.InternalError, nil))
	_, err := st.getSystemToken.Execute(uuid.New())
	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))
}

