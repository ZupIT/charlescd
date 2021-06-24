/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package main

import (
	"database/sql"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/golang-migrate/migrate/v4"
	pgMigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type persistenceManager struct {
	actionRepository          repository.ActionRepository
	actionExecutionRepository repository.ActionExecutionRepository
	datasourceRepository      repository.DatasourceRepository
	metricRepository          repository.MetricRepository
	metricExecutionRepository repository.MetricExecutionRepository
	metricsGroupRepository    repository.MetricsGroupRepository
	metricsGroupAction        repository.MetricsGroupActionRepository
	pluginRepository          repository.PluginRepository
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
	pluginRepo := repository.NewPluginRepository()

	actionRepo := repository.NewActionRepository(db)

	actionExecutionRepository := repository.NewActionExecutionRepository(db)

	datasourceRepo := repository.NewDatasourceRepository(db, pluginRepo)

	metricExecutionRepo := repository.NewMetricExecutionRepository(db)

	metricRepo := repository.NewMetricRepository(db, datasourceRepo, pluginRepo, metricExecutionRepo)

	metricsGroupActionRepo := repository.NewMetricsGroupActionRepository(db, actionExecutionRepository)

	metricsGroupRepo := repository.NewMetricsGroupRepository(db, metricRepo, metricsGroupActionRepo)

	return persistenceManager{
		actionRepository:          actionRepo,
		datasourceRepository:      datasourceRepo,
		metricRepository:          metricRepo,
		metricExecutionRepository: metricExecutionRepo,
		metricsGroupRepository:    metricsGroupRepo,
		metricsGroupAction:        metricsGroupActionRepo,
		pluginRepository:          pluginRepo,
		actionExecutionRepository: actionExecutionRepository,
	}, nil
}
