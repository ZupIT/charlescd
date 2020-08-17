package util

import (
	"compass/internal/iguration"
)

func IsDeveloperRunning() bool {
	return iguration.Getiguration("ENV") == "DEV"
}
