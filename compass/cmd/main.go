package main

import (
	"compass/metricsgroup"
	v1 "compass/web/api/v1"
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

	db, err := gorm.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	metricsgroupMain := metricsgroup.NewMain(db)

	v1 := v1.NewV1()
	v1.NewMetricsGroupApi(metricsgroupMain)
	v1.Start()
}
