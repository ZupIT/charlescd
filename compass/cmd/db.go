package main

import (
	"database/sql"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/dispatcher"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/golang-migrate/migrate/v4"
	pgMigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type persistenceManager struct {
	actionRepository       action.UseCases
	datasourceRepository   datasource.UseCases
	metricRepository       metric.UseCases
	metricsGroupRepository metricsgroup.UseCases
	metricsGroupAction     metricsgroupaction.UseCases
	pluginRepository       plugin.UseCases
	metricDispatcher       dispatcher.UseCases
	actionDispatcher       dispatcher.UseCases
}

var initialValues = map[string]string{
	"DB_USER":                   "charlescd_compass",
	"DB_PASSWORD":               "compass",
	"DB_HOST":                   "localhost",
	"DB_NAME":                   "charlescd_compass",
	"DB_SSL":                    "disable",
	"DB_PORT":                   "5432",
	"PLUGINS_DIR":               "./plugins",
	"MOOVE_URL":                 "http://charlescd-moove:8080",
	"DISPATCHER_INTERVAL":       "15s",
	"MOOVE_USER":                "admin@admin",
	"MOOVE_PATH":                "http://charlescd-moove:8080",
	"MOOVE_AUTH":                "Bearer 123",
	"MOOVE_DB_USER":             "charles",
	"MOOVE_DB_PASSWORD":         "charles",
	"MOOVE_DB_HOST":             "localhost",
	"MOOVE_DB_NAME":             "charles",
	"MOOVE_DB_SSL":              "disable",
	"MOOVE_DB_PORT":             "5432",
	"REQUESTS_PER_SECOND_LIMIT": "1",
	"LIMITER_TOKEN_TTL":         "5",
	"LIMITER_HEADERS_TTL":       "5",
	"ENCRYPTION_KEY":            "caf5a807-5edd-4580-9149-7a4882755716",
}

func prepareDatabase() (persistenceManager, error) {
	sqlDB, gormDB, err := connectDatabase()
	if err != nil {
		return persistenceManager{}, err
	}

	err = runMigrations(sqlDB)
	if err != nil {
		return persistenceManager{}, err
	}

	return loadPersistenceManager(gormDB)
}

func connectDatabase() (*sql.DB, *gorm.DB, error) {
	sqlDb, err := sql.Open("postgres", fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		configuration.Get("DB_USER"),
		configuration.Get("DB_PASSWORD"),
		configuration.Get("DB_HOST"),
		configuration.Get("DB_PORT"),
		configuration.Get("DB_NAME"),
		configuration.Get("DB_SSL"),
	))
	if err != nil {
		return nil, nil, err
	}

	gormDb, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDb,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, nil, err
	}

	return sqlDb, gormDb, nil
}

func connectMooveDatabase() (*gorm.DB, error) {
	db, err := sql.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		configuration.Get("MOOVE_DB_HOST"),
		configuration.Get("MOOVE_DB_PORT"),
		configuration.Get("MOOVE_DB_USER"),
		configuration.Get("MOOVE_DB_NAME"),
		configuration.Get("MOOVE_DB_PASSWORD"),
		configuration.Get("MOOVE_DB_SSL"),
	))
	if err != nil {
		return nil, err
	}

	gormDb, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}
	return gormDb, nil
}

func runMigrations(sqlDb *sql.DB) error {
	driver, err := pgMigrate.WithInstance(sqlDb, &pgMigrate.Config{})
	dbMigrated, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", "resources/migrations"),
		configuration.Get("DB_NAME"), driver)
	if err != nil {
		return err
	}

	if err := dbMigrated.Up(); err != nil && err != migrate.ErrNoChange {
		return err
	}

	return nil
}

func loadPersistenceManager(db *gorm.DB) (persistenceManager, error) {
	pluginRepo := plugin.NewMain()

	actionRepo := action.NewMain(db, pluginRepo)

	datasourceRepo := datasource.NewMain(db, pluginRepo)

	metricRepo := metric.NewMain(db, datasourceRepo, pluginRepo)

	metricsGroupActionRepo := metricsgroupaction.NewMain(db, pluginRepo, actionRepo)

	metricsGroupRepo := metricsgroup.NewMain(db, metricRepo, datasourceRepo, pluginRepo, metricsGroupActionRepo)

	metricDispatcher := dispatcher.NewDispatcher(metricRepo)

	actionDispatcher := dispatcher.NewActionDispatcher(metricsGroupRepo, actionRepo, pluginRepo, metricRepo, metricsGroupActionRepo)

	return persistenceManager{
		actionRepository:       actionRepo,
		datasourceRepository:   datasourceRepo,
		metricRepository:       metricRepo,
		metricsGroupRepository: metricsGroupRepo,
		metricsGroupAction:     metricsGroupActionRepo,
		pluginRepository:       pluginRepo,
		metricDispatcher:       metricDispatcher,
		actionDispatcher:       actionDispatcher,
	}, nil
}
