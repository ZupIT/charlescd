package main

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/dispatcher"
	"compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"compass/pkg/logger"

	utils "compass/internal/util"
	v1 "compass/web/api/v1"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load()

	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
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
	defer db.Close()

	driver, err := postgres.WithInstance(db.DB(), &postgres.Config{})
	if err != nil {
		logger.Fatal("", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		configuration.GetConfiguration("DB_NAME"), driver)

	if err != nil {
		logger.Fatal("", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		logger.Fatal("", err)
	}

	if utils.IsDeveloperRunning() {
		db.LogMode(true)
	}

	pluginMain := plugin.NewMain(db)
	datasourceMain := datasource.NewMain(db, pluginMain)
	metricMain := metric.NewMain(db, datasourceMain, pluginMain)
	metricsgroupMain := metricsgroup.NewMain(db, metricMain, datasourceMain, pluginMain)
	dispatcher := dispatcher.NewDispatcher(metricMain)

	go dispatcher.Start()

	v1 := v1.NewV1()
	v1.NewPluginApi(pluginMain)
	v1.NewMetricsGroupApi(metricsgroupMain)
	v1.NewMetricApi(metricMain, metricsgroupMain)
	v1.NewDataSourceApi(datasourceMain)
	v1.NewCircleApi(metricsgroupMain)
	v1.Start()
}
