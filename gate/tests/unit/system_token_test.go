package unit

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	mocks "github.com/ZupIT/charlescd/gate/tests/unit/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

type SystemTokenSuite struct {
	suite.Suite
	getSystemToken             systemTokenInteractor.GetSystemToken
	systemTokenRepository      *mocks.SystemTokenRepository
	systemToken                domain.SystemToken
}

func (st *SystemTokenSuite) SetupSuite() {
	st.systemTokenRepository = new(mocks.SystemTokenRepository)
	st.getSystemToken = systemTokenInteractor.NewGetSystemToken(st.systemTokenRepository)
}

func (st *SystemTokenSuite) SetupTest() {
	st.SetupSuite()
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(SystemTokenSuite))
}

func (st *SystemTokenSuite) TestGetByID() {
	systemToken := getDummySystemToken()

	st.systemTokenRepository.On("FindById", systemToken.ID).Return(systemToken, nil)
	result, err := st.getSystemToken.Execute(systemToken.ID)

	require.NotNil(st.T(), result)
	require.Nil(st.T(), err)
	require.Equal(st.T(), result.ID, systemToken.ID)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindById", systemToken.ID))
}

func (st *SystemTokenSuite) TestErrorGetByIDNotFound() {
	systemToken := getDummySystemToken()

	st.systemTokenRepository.On("FindById", systemToken.ID).
		Return(systemToken, logging.NewError("Not found error", logging.CustomError{} ,  logging.NotFoundError, nil))
	result, err := st.getSystemToken.Execute(systemToken.ID)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.NotFoundError, logging.GetErrorType(err))
	require.Equal(st.T(), result.ID, uuid.Nil)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindById", systemToken.ID))

}

func (st *SystemTokenSuite) TestErrorGetByIDInternalError() {
	systemToken := getDummySystemToken()

	st.systemTokenRepository.On("FindById", systemToken.ID).
		Return(systemToken, logging.NewError("Internal error", logging.CustomError{}, logging.InternalError, nil))
	result, err := st.getSystemToken.Execute(systemToken.ID)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.InternalError, logging.GetErrorType(err))
	require.Equal(st.T(), result.ID, uuid.Nil)
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindById", systemToken.ID))
}

func getDummySystemToken() domain.SystemToken {
	return domain.SystemToken{
		ID: uuid.New(),
		Name: "SystemToken Test",
		AuthorEmail: "joe.doe@email.com",
		CreatedAt: time.Now(),
		Revoked: false,
	}
}