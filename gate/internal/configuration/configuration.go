package configuration

import (
	"os"
)

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
