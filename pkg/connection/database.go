package connection

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewClient() (*mongo.Client, error) {
	connectionString := fmt.Sprintf(os.Getenv("DB_URL"))
	clientOptions := options.Client().ApplyURI(connectionString)

	client, err := mongo.NewClient(clientOptions)

	if err != nil {
		return nil, err
	}

	err = client.Connect(context.Background())

	if err != nil {
		return nil, err
	}

	return client, nil
}

func NewDatabaseConnection() (*mongo.Database, error) {
	client, err := NewClient()
	if err != nil {
		return nil, err
	}
	database := os.Getenv("DB_NAME")

	return client.Database(database), nil
}
