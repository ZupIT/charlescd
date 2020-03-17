package main

import (
	"flag"
	"log"
	"octopipe/pkg/api"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/mozart"
	"os"
	"path/filepath"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/tools/clientcmd"
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
		&execution.IstioComponent{},
	)

	db.Model(&execution.DeployedComponent{}).AddForeignKey("execution_id", "executions(id)", "RESTRICT", "RESTRICT")
	db.Model(&execution.DeployedComponentManifest{}).AddForeignKey("deployed_component_id", "executions(id)", "RESTRICT", "RESTRICT")
	db.Model(&execution.IstioComponent{}).AddForeignKey("execution_id", "executions(id)", "RESTRICT", "RESTRICT")

	log.Println("Successfully connected!")

	return db, nil
}

func NewDynamicK8sClient() (dynamic.Interface, error) {
	var kubeconfig *string
	if home := os.Getenv("HOME"); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}

	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		return nil, err
	}

	client, err := dynamic.NewForConfig(config)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func main() {
	db, err := NewDatabaseConnection()
	if err != nil {
		log.Fatal(err)
		return
	}

	dynamicK8sClient, err := NewDynamicK8sClient()
	if err != nil {
		log.Fatal(err)
		return
	}

	executionMain := execution.NewExecutionManager(db)
	deployer := deployer.NewDeployer(dynamicK8sClient)
	mozart := mozart.NewMozart(deployer)

	api := api.NewApi()
	api.NewExeuctionApi(executionMain)
	api.NewPipelineApi(mozart)
	api.Start()
}
