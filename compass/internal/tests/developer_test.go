package tests

import (
	"compass/internal/plugin"
	utils "compass/internal/util"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"os"
	"testing"
)

type SuiteDeveloper struct {
	suite.Suite

	repository   plugin.UseCases
}

func (s *SuiteDeveloper) SetupSuite() {
	os.Setenv("ENV", "TEST")
	s.repository = plugin.NewMain()
}


func TestInitSuiteDeveloper(t *testing.T) {
	suite.Run(t, new(SuitePlugins))
}

func (s *Suite) TestIsDeveloperRunning() {
	require.Equal(s.T(), false, utils.IsDeveloperRunning())
}