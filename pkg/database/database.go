package database

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UseCases interface {
	Create(
		collection string, context context.Context, data interface{},
	) (*mongo.InsertOneResult, error)
	FindAll(
		collection string, context context.Context, filter map[string]string, opts interface{},
	) (*mongo.Cursor, error)
	FindOne(
		collection string, context context.Context, filter interface{},
	) *mongo.SingleResult
	UpdateOne(
		collection string, context context.Context, filter interface{}, update interface{},
	) (*mongo.UpdateResult, error)
}

type Database struct {
	DB *mongo.Database
}

func NewDatabase() (UseCases, error) {
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

	database := os.Getenv("DB_NAME")

	return &Database{DB: client.Database(database)}, nil
}

func (database *Database) Create(
	collection string, context context.Context, data interface{},
) (*mongo.InsertOneResult, error) {
	return database.DB.Collection(collection).InsertOne(context, data)
}

func (database *Database) FindAll(
	collection string, context context.Context, filter map[string]string, opts interface{},
) (*mongo.Cursor, error) {
	findOptions := opts.(options.FindOptions)
	return database.DB.Collection(collection).Find(context, filter, &findOptions)
}

func (database *Database) FindOne(
	collection string, context context.Context, filter interface{},
) *mongo.SingleResult {
	return database.DB.Collection(collection).FindOne(context, filter)
}

func (database *Database) UpdateOne(
	collection string, context context.Context, filter interface{}, update interface{},
) (*mongo.UpdateResult, error) {
	return database.DB.Collection(collection).UpdateOne(context, filter, update)
}
