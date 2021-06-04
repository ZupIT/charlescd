package main

import (
	"database/sql"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/golang-migrate/migrate/v4"
	pgMigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type persistenceManager struct {
	actionRepository       action.UseCases
	datasourceRepository   repository.DatasourceRepository
	metricRepository       metric.UseCases
	metricsGroupRepository metricsgroup.UseCases
	metricsGroupAction     metricsgroupaction.UseCases
	pluginRepository       plugin.UseCases
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

	datasourceRepo := repository.NewDatasourceRepository(db, pluginRepo)

	metricRepo := metric.NewMain(db, datasourceRepo, pluginRepo)

	metricsGroupActionRepo := metricsgroupaction.NewMain(db, pluginRepo, actionRepo)

	metricsGroupRepo := metricsgroup.NewMain(db, metricRepo, datasourceRepo, pluginRepo, metricsGroupActionRepo)

	return persistenceManager{
		actionRepository:       actionRepo,
		datasourceRepository:   datasourceRepo,
		metricRepository:       metricRepo,
		metricsGroupRepository: metricsGroupRepo,
		metricsGroupAction:     metricsGroupActionRepo,
		pluginRepository:       pluginRepo,
	}, nil
}
