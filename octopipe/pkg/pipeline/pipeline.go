package pipeline

import (
	"context"
	"log"
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Git struct {
	Provider string `json:"provider"`
	Token    string `json:"token"`
}

type Template struct {
	Type       string            `json:"type"`
	Repository string            `json:"repository"`
	Override   map[string]string `json:"overrideValues"`
}

type Step struct {
	Name           string                       `json:"name"`
	ModuleName     string                       `json:"moduleName"`
	Namespace      string                       `json:"namespace"`
	Action         string                       `json:"action"`
	RollbackAction string                       `json:"action"`
	Webhook        string                       `json:"webhook"`
	ForceUpdate    bool                         `json:"forceUpdate"`
	Manifest       map[string]interface{}       `json:"manifest"`
	Template       *Template                    `json:"template"`
	Git            *Git                         `json:"git"`
	K8sConfig      *cloudprovider.Cloudprovider `json:"k8s"`
}

type Pipeline struct {
	ID      primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name    string             `json:"name"`
	Webhook string             `json:"webhook"`
	Stages  [][]*Step          `json:"stages"`
}

type UseCases interface {
	FindAll() (*[]Pipeline, error)
	FindByID(id string) (*Pipeline, error)
	Create(pipeline *Pipeline) (*primitive.ObjectID, error)
}

type PipelineManager struct {
	DB database.UseCases
}

const (
	collection = "pipelines"
)

func NewPipelineManager(db database.UseCases) UseCases {
	return &PipelineManager{DB: db}
}

func (executionManager *PipelineManager) FindAll() (*[]Pipeline, error) {
	executions := []Pipeline{}
	sort := map[string]int{"starttime": -1}
	opts := &options.FindOptions{
		Sort: sort,
	}
	cur, err := executionManager.DB.FindAll(collection, context.TODO(), map[string]string{}, opts)
	if err != nil {
		return nil, err
	}

	for cur.Next(context.TODO()) {
		var execution Pipeline
		err := cur.Decode(&execution)

		if err != nil {
			return nil, err
		}

		executions = append(executions, execution)
	}

	return &executions, nil

}

func (executionManager *PipelineManager) FindByID(id string) (*Pipeline, error) {
	pipeline := Pipeline{}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": objectID}
	err = executionManager.DB.FindOne(collection, context.TODO(), filter).Decode(&pipeline)
	if err != nil {
		return nil, err
	}

	return &pipeline, nil
}

func (executionManager *PipelineManager) Create(pipeline *Pipeline) (*primitive.ObjectID, error) {
	newPipeline := &Pipeline{
		Name: pipeline.Name,
	}

	newPipeline.ID = primitive.NewObjectID()
	result, err := executionManager.DB.Create(collection, context.TODO(), newPipeline)
	if err != nil {
		log.Println("ERROR", err)
		return nil, err
	}

	log.Println("RESULT", result)

	objID := result.InsertedID.(primitive.ObjectID)
	return &objID, nil
}
