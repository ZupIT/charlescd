package util

import "os"

func IsDeleveloperRunning() bool {
	return os.Getenv("ENV") == "DEV"
}
