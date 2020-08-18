package configuration

import "os"

var initialValues = map[string]string{
	"DB_USER":     "charlescd_compass",
	"DB_PASSWORD": "compass",
	"DB_HOST":     "localhost",
	"DB_NAME":     "charlescd_compass",
	"DB_SSL":      "disable",
	"DB_PORT":     "5432",
	"PLUGINS_DIR": "./plugins",
	"TIMEOUT":     "10",
}

func GetConfiguration(configuration string) string {
	env := os.Getenv(configuration)
	if env == "" {
		return initialValues[configuration]
	}

	return env
}
