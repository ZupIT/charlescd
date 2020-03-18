package connection

import (
	"log"
	"octopipe/pkg/execution"
	"os"

	"github.com/jinzhu/gorm"
	"github.com/joho/godotenv"
)

func NewDatabaseConnection() (*gorm.DB, error) {
	err := godotenv.Load(".env")
	if err != nil {
		return nil, err
	}

	db, err := gorm.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(
		&execution.Execution{},
		&execution.DeployedComponent{},
		&execution.DeployedComponentManifest{},
		&execution.UndeployedComponent{},
		&execution.UndeployedComponentManifest{},
		&execution.IstioComponent{},
	)

	db.Model(&execution.DeployedComponent{}).AddForeignKey("execution_id", "executions(id)", "RESTRICT", "RESTRICT")
	db.Model(&execution.DeployedComponentManifest{}).AddForeignKey("deployed_component_id", "deployed_components(id)", "RESTRICT", "RESTRICT")
	db.Model(&execution.UndeployedComponent{}).AddForeignKey("execution_id", "executions(id)", "RESTRICT", "RESTRICT")
	db.Model(&execution.UndeployedComponentManifest{}).AddForeignKey("undeployed_component_id", "undeployed_components(id)", "RESTRICT", "RESTRICT")
	db.Model(&execution.IstioComponent{}).AddForeignKey("execution_id", "executions(id)", "RESTRICT", "RESTRICT")

	log.Println("Successfully connected!")

	return db, nil
}
