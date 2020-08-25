package plugin

import (
	"database/sql"
	"os"
	"path/filepath"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type Suite struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository UseCases
	datasource *Plugin
}

func (s *Suite) SetupSuite() {
	var (
		db  *sql.DB
		err error
	)

	db, s.mock, err = sqlmock.New()
	require.NoError(s.T(), err)

	s.DB, err = gorm.Open("postgres", db)
	require.NoError(s.T(), err)

	s.DB.LogMode(true)

	s.repository = NewMain(s.DB)
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) TestValidate() {
	plugin := Plugin{}
	var errList = plugin.Validate()

	require.NotEmpty(s.T(), errList)
}

func (s *Suite) TestFindAll() {
	var (
		name = "Fake Plugin"
		src  = "fake_plugin"
	)

	os.Setenv("PLUGINS_DIR", filepath.Join("./fake"))

	res, err := s.repository.FindAll()

	expected := Plugin{
		Name: name,
		Src:  src,
	}

	require.NoError(s.T(), err)
	require.Contains(s.T(), res, expected)
}

func (s *Suite) TestFindAllError() {

	os.Setenv("PLUGINS_DIR", filepath.Join("./teste"))

	_, err := s.repository.FindAll()

	require.Error(s.T(), err)
}
