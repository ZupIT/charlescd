package metricsgroup

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/metric"
	"compass/internal/plugin"
	"compass/internal/util"
	"fmt"
	"path/filepath"
	"testing"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type Suite struct {
	suite.Suite
	db               *gorm.DB
	metricsgroupMain UseCases
	circleID         uuid.UUID
	workspaceID      uuid.UUID
}

func (s *Suite) SetupSuite() {
	var err error
	s.db, err = gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		configuration.GetConfiguration("DB_HOST"),
		configuration.GetConfiguration("DB_PORT"),
		configuration.GetConfiguration("DB_USER"),
		configuration.GetConfiguration("DB_NAME"),
		configuration.GetConfiguration("DB_PASSWORD"),
		configuration.GetConfiguration("DB_SSL"),
	))
	if err != nil {
		util.Fatal("Failed to connect database", err)
	}

	driver, err := postgres.WithInstance(s.db.DB(), &postgres.Config{})
	if err != nil {
		util.Fatal("", err)
	}

	fmt.Println(filepath.Join("migrations", "../../"))

	m, err := migrate.NewWithDatabaseInstance(
		"file://../../migrations",
		configuration.GetConfiguration("DB_NAME"), driver)

	if err != nil {
		util.Fatal("", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		util.Fatal("", err)
	}

	pluginMain := plugin.NewMain(s.db)
	datasourceMain := datasource.NewMain(s.db, pluginMain)
	metricMain := metric.NewMain(s.db, datasourceMain, pluginMain)

	s.metricsgroupMain = NewMain(s.db, metricMain, datasourceMain, pluginMain)
	s.circleID = uuid.New()
	s.workspaceID = uuid.New()
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) TestValidate() {
	metricGroup := MetricsGroup{
		BaseModel: util.BaseModel{
			ID: uuid.New(),
		},
		Name:        "group 1",
		WorkspaceID: s.workspaceID,
		CircleID:    s.circleID,
	}

	ers := s.metricsgroupMain.Validate(metricGroup)

	require.Empty(s.T(), ers)
}

func (s *Suite) TestValidateError() {
	metricGroup := MetricsGroup{
		BaseModel: util.BaseModel{
			ID: uuid.New(),
		},
		Name:        "",
		WorkspaceID: s.workspaceID,
		CircleID:    uuid.Nil,
	}

	ers := s.metricsgroupMain.Validate(metricGroup)

	require.Contains(s.T(), ers[0].Error, "Name is required")
	require.Contains(s.T(), ers[1].Error, "CircleID is required")
}

func (s *Suite) InsertMetricGroups(metricGroups []MetricsGroup) {
	for _, metricGroup := range metricGroups {
		s.db.Create(&metricGroup)
	}
}

func (s *Suite) DeleteMetricGroups(metricGroups []MetricsGroup) {
	for _, metricGroup := range metricGroups {
		s.db.Where("name = ?", metricGroup.Name).Delete(&metricGroup)
	}
}

func (s *Suite) TestFindAll() {
	insertMetricGroups := []MetricsGroup{
		{
			Name:        "group 1",
			CircleID:    s.circleID,
			WorkspaceID: s.workspaceID,
		},
		{
			Name:        "group 2",
			CircleID:    s.circleID,
			WorkspaceID: s.workspaceID,
		},
	}

	s.InsertMetricGroups(insertMetricGroups)
	metricGroups, err := s.metricsgroupMain.FindAll()
	if err != nil {
		s.DeleteMetricGroups(insertMetricGroups)
		s.T().Fatal(err)
	}

	require.Equal(s.T(), len(insertMetricGroups), len(metricGroups))
	for index, metricGroup := range metricGroups {
		metricGroup.BaseModel = insertMetricGroups[index].BaseModel
		require.Equal(s.T(), insertMetricGroups[index], metricGroup)
	}

	s.DeleteMetricGroups(insertMetricGroups)

}
