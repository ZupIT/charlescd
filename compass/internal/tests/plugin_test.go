package tests

import (
	"compass/internal/plugin"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuitePlugins struct {
	suite.Suite

	repository plugin.UseCases
}

func (s *SuitePlugins) SetupSuite() {
	os.Setenv("ENV", "TEST")
	s.repository = plugin.NewMain()
}

func TestInitPlugins(t *testing.T) {
	suite.Run(t, new(SuitePlugins))
}

func (s *SuitePlugins) TestFindAll() {
	expectedPlugins := []plugin.Plugin{
		{
			Name: "Google Analytics",
			Src:  "google_analytics",
		},
		{
			Name: "Prometheus",
			Src:  "prometheus",
		},
	}

	os.Setenv("PLUGINS_DIR", "../../plugins")
	plugins, err := s.repository.FindAll()
	require.NoError(s.T(), err)

	for i, p := range plugins {
		require.Equal(s.T(), expectedPlugins[i], p)
	}
}

func (s *SuitePlugins) TestFindAllNoSuchDirectory() {
	os.Setenv("PLUGINS_DIR", "./plugin")

	_, err := s.repository.FindAll()
	require.Error(s.T(), err)
}
