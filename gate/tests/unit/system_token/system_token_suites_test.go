package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	mocks "github.com/ZupIT/charlescd/gate/tests/unit/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

type SystemTokenSuite struct {
	suite.Suite
	getSystemToken        systemTokenInteractor.GetSystemToken
	getAllSystemToken     systemTokenInteractor.GetAllSystemToken
	systemTokenRepository *mocks.SystemTokenRepository
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

func getDummySystemToken() domain.SystemToken {
	createdAt := time.Now()
	return domain.SystemToken{
		ID: uuid.New(),
		Name: "SystemToken Test",
		AuthorEmail: "joe.doe@email.com",
		CreatedAt: &createdAt,
		Revoked: false,
	}
}

