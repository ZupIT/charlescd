package main

import (
	"database/sql"
	"fmt"
	"github.com/ZupIT/charlescd/gate/internal/configuration"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/golang-migrate/migrate/v4"
	pgMigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type persistenceManager struct {
	systemTokenRepository repository.SystemTokenRepository
}

func prepareDatabase() (persistenceManager, error) {
	db, err := connectDatabase()
	if err != nil {
		return persistenceManager{}, err
	}

	/*
	//TODO: delete this comment after creating the migrations' scripts
	err = runMigrations(sqlDB)
	if err != nil {
		return persistenceManager{}, err
	}
	 */

	return loadPersistenceManager(db)
}

func connectDatabase() (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		configuration.Get("DB_HOST"),
		configuration.Get("DB_PORT"),
		configuration.Get("DB_USER"),
		configuration.Get("DB_NAME"),
		configuration.Get("DB_PASSWORD"),
		configuration.Get("DB_SSL"),
	)), &gorm.Config{})

	return db, err
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
	return persistenceManager{}, nil
}