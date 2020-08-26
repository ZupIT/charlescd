package metricsgroup

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/metric"
	"compass/internal/plugin"
	"compass/internal/util"
	"compass/pkg/logger"
	"fmt"
	"path/filepath"
	"testing"
	"time"

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
	metricMain       metric.UseCases
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
		logger.Fatal("Failed to connect database", err)
	}

	driver, err := postgres.WithInstance(s.db.DB(), &postgres.Config{})
	if err != nil {
		logger.Fatal("", err)
	}

	fmt.Println(filepath.Join("migrations", "../../"))

	m, err := migrate.NewWithDatabaseInstance(
		"file://../../migrations",
		configuration.GetConfiguration("DB_NAME"), driver)

	if err != nil {
		logger.Fatal("", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		logger.Fatal("", err)
	}

	pluginMain := plugin.NewMain(s.db)
	datasourceMain := datasource.NewMain(s.db, pluginMain)
	metricMain := metric.NewMain(s.db, datasourceMain, pluginMain)

	s.metricMain = metricMain
	s.metricsgroupMain = NewMain(s.db, metricMain, datasourceMain, pluginMain)
	s.circleID = uuid.New()
	s.workspaceID = uuid.New()
}

func (s *Suite) BeforeTest(suiteName, testName string) {
	s.db.Exec("delete from metrics_groups")
	s.db.Exec("delete from data_sources")
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

	for _, metricGroup := range insertMetricGroups {
		s.db.Create(&metricGroup)
	}

	metricGroups, err := s.metricsgroupMain.FindAll()
	if err != nil {
		s.T().Fatal(err)
	}

	require.Equal(s.T(), len(insertMetricGroups), len(metricGroups))
	for index, metricGroup := range metricGroups {
		metricGroup.BaseModel = insertMetricGroups[index].BaseModel
		metricGroup.Metrics = nil
		require.Equal(s.T(), insertMetricGroups[index], metricGroup)
	}
}

func (s *Suite) TestResumeByCircle() {
	insertDatasource := datasource.DataSource{
		Name:        "data source 1",
		PluginSrc:   "prometheus",
		Health:      false,
		Data:        []byte(`{ "url": "http://localt:9090" }`),
		WorkspaceID: s.workspaceID,
	}

	s.db.Create(&insertDatasource)

	metricGroup := MetricsGroup{
		Name:        "group 1",
		CircleID:    s.circleID,
		WorkspaceID: s.workspaceID,
	}

	s.db.Create(&metricGroup)

	insertMetric := metric.Metric{
		DataSourceID:   insertDatasource.ID,
		MetricsGroupID: metricGroup.ID,
		Nickname:       "metric 1",
		Query:          "tdfd ddd",
		Condition:      "EQUAL",
		Threshold:      1,
	}

	_, err := s.metricMain.SaveMetric(insertMetric)
	if err != nil {
		s.T().Error(err)
	}

	resume, err := s.metricsgroupMain.ResumeByCircle(s.circleID.String())
	if err != nil {
		s.T().Fatal(err)
	}

	time.Sleep(20 * time.Second)

	fmt.Println("Threshold: ", resume[0].Thresholds)
	fmt.Println("Threshold reached: ", resume[0].ThresholdsReached)
	fmt.Println("Metrics : ", resume[0].Metrics)
	fmt.Println("Status : ", resume[0].Status)
}
