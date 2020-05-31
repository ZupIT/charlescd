/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
		context context.Context, collection string, data interface{},
	) (*mongo.InsertOneResult, error)
	FindAll(
		context context.Context, collection string, filter map[string]string, opts interface{},
	) (*mongo.Cursor, error)
	FindOne(
		context context.Context, collection string, filter interface{},
	) *mongo.SingleResult
	UpdateOne(
		context context.Context, collection string, filter interface{}, update interface{},
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
	context context.Context, collection string, data interface{},
) (*mongo.InsertOneResult, error) {
	return database.DB.Collection(collection).InsertOne(context, data)
}

func (database *Database) FindAll(
	context context.Context, collection string, filter map[string]string, opts interface{},
) (*mongo.Cursor, error) {
	findOptions := opts.(*options.FindOptions)
	return database.DB.Collection(collection).Find(context, filter, findOptions)
}

func (database *Database) FindOne(
	context context.Context, collection string, filter interface{},
) *mongo.SingleResult {
	return database.DB.Collection(collection).FindOne(context, filter)
}

func (database *Database) UpdateOne(
	context context.Context, collection string, filter interface{}, update interface{},
) (*mongo.UpdateResult, error) {
	return database.DB.Collection(collection).UpdateOne(context, filter, update)
}
