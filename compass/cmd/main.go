package main

import (
	"compass/internal/datasource"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	utils "compass/internal/util"
	v1 "compass/web/api/v1"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_SSL"),
	))
	if err != nil {
		log.Fatalln("failed to connect database")
	}
	defer db.Close()

	driver, err := postgres.WithInstance(db.DB(), &postgres.Config{})

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		os.Getenv("DB_NAME"), driver)

	if err != nil {
		log.Fatal(err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal(err)
	}

	if utils.IsDeleveloperRunning() {
		db.LogMode(true)
	}

	pluginMain := plugin.NewMain(db)
	datasourceMain := datasource.NewMain(db, pluginMain)
	metricsgroupMain := metricsgroup.NewMain(db, datasourceMain, pluginMain)

	_, err = strconv.Atoi(os.Getenv("TIMEOUT"))
	if err != nil {
		log.Fatal(err)
	}

	// dispatcher.StartDispatcher(metricsgroupMain, sleepTime)

	v1 := v1.NewV1()
	v1.NewPluginApi(pluginMain)
	v1.NewMetricsGroupApi(metricsgroupMain)
	v1.NewDataSourceApi(datasourceMain)
	v1.Start()
}
