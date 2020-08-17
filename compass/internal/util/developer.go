package util

import (
	"compass/internal/configuration"
)

func IsDeveloperRunning() bool {
	return configuration.GetConfiguration("ENV") == "DEV"
}
