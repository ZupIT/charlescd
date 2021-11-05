/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

	"github.com/ZupIT/charlescd/gate/internal/configuration"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/golang-migrate/migrate/v4"
	pgMigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	gormcrypto "github.com/pkosilo/gorm-crypto"
	"github.com/pkosilo/gorm-crypto/algorithms"
	"github.com/pkosilo/gorm-crypto/serialization"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type persistenceManager struct {
	systemTokenRepository repository.SystemTokenRepository
	permissionRepository  repository.PermissionRepository
	userRepository        repository.UserRepository
	workspaceRepository   repository.WorkspaceRepository
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

	err = initCryptoLib()
	if err != nil {
		return persistenceManager{}, err
	}

	return loadPersistenceManager(gormDB)
}

func connectDatabase() (*sql.DB, *gorm.DB, error) {
	sqlDb, err := sql.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		configuration.Get("DB_HOST"),
		configuration.Get("DB_PORT"),
		configuration.Get("DB_USER"),
		configuration.Get("DB_NAME"),
		configuration.Get("DB_PASSWORD"),
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
	if err != nil {
		return err
	}
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

func initCryptoLib() error {
	aes, err := algorithms.NewAES256GCM([]byte(configuration.Get("ENCRYPTION_KEY")))
	if err != nil {
		return err
	}
	gormcrypto.Init(aes, serialization.NewJSON())
	return nil
}

func loadPersistenceManager(db *gorm.DB) (persistenceManager, error) {
	queriesPath := configuration.Get("QUERIES_PATH")

	systemTokenRepo, err := repository.NewSystemTokenRepository(db)
	if err != nil {
		return persistenceManager{}, fmt.Errorf("cannot instantiate system token repository with error: %w", err)
	}

	permissionRepo, err := repository.NewPermissionRepository(db, queriesPath)
	if err != nil {
		return persistenceManager{}, fmt.Errorf("cannot instantiate permission repository with error: %s", err.Error())
	}

	userRepo, err := repository.NewUserRepository(db)
	if err != nil {
		return persistenceManager{}, fmt.Errorf("Cannot instantiate user repository with error: %s", err.Error())
	}

	workspaceRepo, err := repository.NewWorkspaceRepository(db, queriesPath)
	if err != nil {
		return persistenceManager{}, fmt.Errorf("Cannot instantiate workspace repository with error: %s", err.Error())
	}

	return persistenceManager{
		systemTokenRepository: systemTokenRepo,
		permissionRepository:  permissionRepo,
		userRepository:        userRepo,
		workspaceRepository:   workspaceRepo,
	}, nil
}
