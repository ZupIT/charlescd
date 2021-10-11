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

package configuration

import (
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	postgresmigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	// Only needs init function
	_ "github.com/golang-migrate/migrate/v4/source/file"
	// Only needs init function
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
	"strconv"
)

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

	if err != nil {
		return nil, err
	}

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
		logrus.WithFields(logrus.Fields{
			"err": fmt.Sprintf("%s key not found in the .env file", configuration),
		}).Warnln()
		return env
	}

	return env
}

func GetConfigurationAsInt64(configuration string) int64 {
	env := os.Getenv(configuration)
	if env == "" {
		logrus.WithFields(logrus.Fields{
			"err": fmt.Sprintf("%s key not found in the .env file", configuration),
		}).Warnln()
	}

	envAsInt64, err := strconv.ParseInt(env, 10, 64)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": fmt.Sprintf("%s parse error", err),
		}).Warnln()
	}
	return envAsInt64
}

func GetConfigurationAsInt(configuration string) int {
	env := os.Getenv(configuration)
	if env == "" {
		logrus.WithFields(logrus.Fields{
			"err": fmt.Sprintf("%s key not found in the .env file", configuration),
		}).Warnln()
	}

	envAsInt, err := strconv.Atoi(env)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err": fmt.Sprintf("%s parse error", err),
		}).Warnln()
	}
	return envAsInt
}
