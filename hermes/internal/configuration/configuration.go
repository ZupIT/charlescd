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

package configuration

import (
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	postgresmigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

var initialValues = map[string]string{
	"DB_USER":        "charlescd_hermes",
	"DB_PASSWORD":    "charlescd_hermes",
	"DB_HOST":        "localhost",
	"DB_NAME":        "charlescd_hermes",
	"DB_SSL":         "disable",
	"DB_PORT":        "5432",
	"ENCRYPTION_KEY": "maycon",
}

func GetDBConnection(migrationsPath string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		GetConfiguration("DB_HOST"),
		GetConfiguration("DB_PORT"),
		GetConfiguration("DB_USER"),
		GetConfiguration("DB_NAME"),
		GetConfiguration("DB_PASSWORD"),
		GetConfiguration("DB_SSL"),
	)), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	dbInstance, err := db.DB()
	if err != nil {
		return nil, err
	}

	driver, err := postgresmigrate.WithInstance(dbInstance, &postgresmigrate.Config{})

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", migrationsPath),
		GetConfiguration("DB_NAME"), driver)

	if err != nil {
		return nil, err
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return nil, err
	}

	return db, err
}

func GetConfiguration(configuration string) string {
	env := os.Getenv(configuration)
	if env == "" {
		return initialValues[configuration]
	}

	return env
}
