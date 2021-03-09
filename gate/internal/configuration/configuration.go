package configuration

import (
	"github.com/joho/godotenv"
	"os"
)

func LoadConfigurations() error {
	err := godotenv.Load("./resources/.env")
	if err != nil {
		return err
	}

	return nil
}

func Get(name string) string {
	return os.Getenv(name)
}

func IsRunningInProduction() bool {
	switch env := Get("ENV"); env {
	case "PROD":
		return true
	default:
		return false
	}
}
