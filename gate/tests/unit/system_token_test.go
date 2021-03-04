package unit

import (
	"testing"
	"time"

	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	mocks "github.com/ZupIT/charlescd/gate/tests/unit/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SystemTokenSuite struct {
	suite.Suite
	getSystemToken        systemTokenInteractor.GetSystemToken
	revokeSystemToken     systemTokenInteractor.RevokeSystemToken
	systemTokenRepository *mocks.SystemTokenRepository
}

func (st *SystemTokenSuite) SetupSuite() {
	st.systemTokenRepository = new(mocks.SystemTokenRepository)
	st.getSystemToken = systemTokenInteractor.NewGetSystemToken(st.systemTokenRepository)
	st.revokeSystemToken = systemTokenInteractor.NewRevokeSystemToken(st.systemTokenRepository)
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
	st.systemTokenRepository.On("FindById", mock.Anything).Return(domain.SystemToken{}, logging.NewError("Not found error", logging.CustomError{}, logging.NotFoundError, nil))
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

func (st *SystemTokenSuite) TestRevokeSystemToken() {
	systemToken := getDummySystemToken()

	st.systemTokenRepository.On("FindById", systemToken.ID).Return(systemToken, nil).Once()
	st.systemTokenRepository.On("Update", mock.AnythingOfType("domain.SystemToken")).Return(systemToken, nil).Once()

	err := st.revokeSystemToken.Execute(systemToken.ID)

	require.Nil(st.T(), err)

	require.Equal(st.T(), 2, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindById", systemToken.ID))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "Update", mock.AnythingOfType("domain.SystemToken")))

	updatedSystemToken := st.systemTokenRepository.Calls[1].Parent.Calls[1].Arguments.Get(0).(domain.SystemToken)
	require.NotNil(st.T(), updatedSystemToken)
	require.True(st.T(), updatedSystemToken.Revoked)
	require.NotNil(st.T(), updatedSystemToken.RevokedAt)
}

func (st *SystemTokenSuite) TestRevokeSystemTokenIDNotFound() {
	uuid := uuid.New()
	st.systemTokenRepository.On("FindById", uuid).
		Return(domain.SystemToken{}, logging.NewError("Not found error", logging.CustomError{}, logging.NotFoundError, nil)).Once()

	err := st.revokeSystemToken.Execute(uuid)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.NotFoundError, logging.GetErrorType(err))

	require.Equal(st.T(), 1, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindById", uuid))
}

func (st *SystemTokenSuite) TestRevokeSystemTokenErrorWhenUpdating() {
	systemToken := getDummySystemToken()

	st.systemTokenRepository.On("FindById", systemToken.ID).Return(systemToken, nil).Once()
	st.systemTokenRepository.On("Update", mock.AnythingOfType("domain.SystemToken")).
		Return(systemToken, logging.NewError("Not found error", logging.CustomError{}, logging.NotFoundError, nil)).Once()

	err := st.revokeSystemToken.Execute(systemToken.ID)

	require.Error(st.T(), err)
	require.Equal(st.T(), logging.NotFoundError, logging.GetErrorType(err))

	require.Equal(st.T(), 2, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindById", systemToken.ID))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "Update", mock.AnythingOfType("domain.SystemToken")))
}

func (st *SystemTokenSuite) TestRevokeSystemTokenOkIfTokenIsAlreadyRevoked() {
	systemToken := getDummySystemToken()
	systemToken.Revoked = true

	st.systemTokenRepository.On("FindById", systemToken.ID).Return(systemToken, nil).Once()

	err := st.revokeSystemToken.Execute(systemToken.ID)

	require.Nil(st.T(), err)

	require.Equal(st.T(), 1, len(st.systemTokenRepository.ExpectedCalls))
	require.True(st.T(), st.systemTokenRepository.AssertCalled(st.T(), "FindById", systemToken.ID))
}

func getDummySystemToken() domain.SystemToken {
	createdAt := time.Now()
	return domain.SystemToken{
		ID:          uuid.New(),
		Name:        "SystemToken Test",
		AuthorEmail: "joe.doe@email.com",
		CreatedAt:   &createdAt,
		Revoked:     false,
	}
}
