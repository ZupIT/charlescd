package util

import (
	"compass/internal/configuration"
)

func IsDeleveloperRunning() bool {
	return configuration.GetConfiguration("ENV") == "DEV"
}
