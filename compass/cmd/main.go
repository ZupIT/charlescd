package main

import (
	"compass/metricsgroup"
	v1 "compass/web/api/v1"
	"fmt"
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s user=%s dbname=%s password=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_SSL"),
	))
	if err != nil {
		log.Fatalln("failed to connect database")
	}
	defer db.Close()

	metricsgroupMain := metricsgroup.NewMain(db)

	v1 := v1.NewV1()
	v1.NewMetricsGroupApi(metricsgroupMain)
	v1.Start()
}
