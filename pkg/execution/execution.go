package execution

import (
	"context"
	"encoding/json"
	"log"
	"octopipe/pkg/pipeline"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/bson"

	"go.mongodb.org/mongo-driver/mongo"
)

type ExecutionManager struct {
	DB *mongo.Database
}

type UseCases interface {
	FindAll() (*[]Execution, error)
	FindByID(id string) (*Execution, error)
	Create(pipeline *pipeline.Pipeline) (*primitive.ObjectID, error)
	CreateVersion(
		executionID *primitive.ObjectID, version *pipeline.Version,
	) (*primitive.ObjectID, error)
	CreateVersionManifest(
		executionID *primitive.ObjectID, versionID *primitive.ObjectID, name string, manifest interface{},
	) (*primitive.ObjectID, error)
	CreateIstioComponent(
		executionID *primitive.ObjectID, name string, manifest interface{},
	) (*primitive.ObjectID, error)
	CreateUnusedVersion(executionID *primitive.ObjectID, name string)
	UpdateExecutionStatus(executionID *primitive.ObjectID, status string)
	UpdateManifestStatus(
		executionID *primitive.ObjectID, versionID *primitive.ObjectID, manifestID *primitive.ObjectID, status string,
	)
	FinishExecution(executionID *primitive.ObjectID, status string)
}

const (
	ExecutionRunning       = "RUNNING"
	ExecutionFailed        = "FAILED"
	ExecutionWebhookFailed = "WEBHOOK_FAILED"
	ExecutionFinished      = "SUCCEEDED"
)

const (
	ManifestCreated   = "CREATED"
	ManifestDeploying = "DEPLOYING"
	ManifestDeployed  = "DEPLOYED"
)

const collection = "executions"

type ExecutionManifest struct {
	ID       primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name     string             `json:"name"`
	Manifest string             `json:"manifest"`
	Status   string             `json:"status"`
}

type ExecutionVersion struct {
	ID        primitive.ObjectID  `bson:"_id" json:"id,omitempty"`
	Name      string              `json:"name"`
	ImageURL  string              `json:"imageURL"`
	Manifests []ExecutionManifest `json:"manifests"`
}

type Execution struct {
	ID                 primitive.ObjectID  `bson:"_id" json:"id,omitempty"`
	Name               string              `json:"name"`
	Namespace          string              `json:"namespace"`
	DeployedVersions   []ExecutionVersion  `json:"deployedVersions"`
	UndeployedVersions []string            `json:"undeployedVersions"`
	IstioComponents    []ExecutionManifest `json:"istioComponents"`
	Author             string              `json:"author"`
	StartTime          time.Time           `json:"startTime"`
	FinishTime         time.Time           `json:"finishTime"`
	Webhook            string              `json:"webhook"`
	Status             string              `json:"status"`
	HelmURL            string              `json:"helmUrl"`
	Error              string              `json:"error"`
}

type ExecutionListItem struct {
	ID         primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name       string             `json:"name"`
	Namespace  string             `json:"namespace"`
	StartTime  time.Time          `json:"startTime"`
	FinishTime time.Time          `json:"finishTime"`
	Status     string             `json:"status"`
}

func NewExecutionManager(db *mongo.Database) *ExecutionManager {
	return &ExecutionManager{db}
}

func (executionManager *ExecutionManager) FindAll() (*[]Execution, error) {
	executions := []Execution{}
	cur, err := executionManager.DB.Collection(collection).Find(context.TODO(), map[string]string{}, &options.FindOptions{})
	if err != nil {
		return nil, err
	}

	for cur.Next(context.TODO()) {
		var execution Execution
		err := cur.Decode(&execution)

		if err != nil {
			return nil, err
		}

		executions = append(executions, execution)
	}

	return &executions, nil

}

func (executionManager *ExecutionManager) FindByID(id string) (*Execution, error) {
	execution := Execution{}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": objectID}
	collection := executionManager.DB.Collection(collection)
	err = collection.FindOne(context.TODO(), filter).Decode(&execution)
	if err != nil {
		return nil, err
	}

	return &execution, nil
}

func (executionManager *ExecutionManager) Create(pipeline *pipeline.Pipeline) (*primitive.ObjectID, error) {
	newExecution := &Execution{
		Name:               pipeline.Name,
		Namespace:          pipeline.Namespace,
		Author:             pipeline.GithubAccount.Username,
		StartTime:          time.Now(),
		DeployedVersions:   []ExecutionVersion{},
		UndeployedVersions: []string{},
		IstioComponents:    []ExecutionManifest{},
		Webhook:            pipeline.Webhook,
		Status:             ExecutionRunning,
		HelmURL:            pipeline.HelmRepository,
	}

	col := executionManager.DB.Collection(collection)
	newExecution.ID = primitive.NewObjectID()
	result, err := col.InsertOne(context.TODO(), newExecution)
	if err != nil {
		log.Println("ERROR", err)
		return nil, err
	}

	log.Println("RESULT", result)

	objID := result.InsertedID.(primitive.ObjectID)
	return &objID, nil
}

func (executionManager *ExecutionManager) UpdateExecutionStatus(executionID *primitive.ObjectID, status string) {
	col := executionManager.DB.Collection(collection)
	query := bson.M{"_id": executionID}

	updateData := bson.M{
		"$set": bson.M{
			"status": status,
		},
	}
	_, _ = col.UpdateOne(context.TODO(), query, updateData)
}

func (executionManager *ExecutionManager) CreateVersion(
	executionID *primitive.ObjectID, version *pipeline.Version,
) (*primitive.ObjectID, error) {
	col := executionManager.DB.Collection(collection)
	newID := primitive.NewObjectID()
	newVersion := &ExecutionVersion{
		ID:        newID,
		Name:      version.Version,
		ImageURL:  version.VersionURL,
		Manifests: []ExecutionManifest{},
	}

	query := bson.M{"_id": executionID}

	updateData := bson.M{
		"$push": bson.M{
			"deployedversions": newVersion,
		},
	}
	_, err := col.UpdateOne(context.TODO(), query, updateData)

	if err != nil {
		return nil, err
	}

	return &newID, nil
}

func (executionManager *ExecutionManager) CreateVersionManifest(
	executionID *primitive.ObjectID, versionID *primitive.ObjectID, name string, manifest interface{},
) (*primitive.ObjectID, error) {
	col := executionManager.DB.Collection(collection)
	newID := primitive.NewObjectID()
	rawManifest, _ := json.Marshal(manifest)
	newManifest := &ExecutionManifest{
		ID:       newID,
		Name:     name,
		Manifest: string(rawManifest),
		Status:   ManifestDeploying,
	}

	query := bson.M{"_id": executionID, "deployedversions._id": versionID}

	updateData := bson.M{
		"$push": bson.M{
			"deployedversions.$.manifests": newManifest,
		},
	}
	_, err := col.UpdateOne(context.TODO(), query, updateData)

	if err != nil {
		return nil, err
	}

	return &newID, nil
}

func (executionManager *ExecutionManager) UpdateManifestStatus(
	executionID *primitive.ObjectID, versionID *primitive.ObjectID, manifestID *primitive.ObjectID, status string,
) {
	col := executionManager.DB.Collection(collection)
	query := bson.M{
		"_id":                            executionID,
		"deployedversions._id":           versionID,
		"deployedversions.manifests._id": manifestID,
	}

	updateData := bson.M{
		"$set": bson.M{
			"deployedversions.$[outer].manifests.$[inner].status": status,
		},
	}

	filterArray := []interface{}{
		map[string]*primitive.ObjectID{"outer._id": versionID},
		map[string]*primitive.ObjectID{"inner._id": manifestID},
	}

	options := options.UpdateOptions{ArrayFilters: &options.ArrayFilters{Filters: filterArray}}

	_, _ = col.UpdateOne(context.TODO(), query, updateData, &options)
}

func (executionManager *ExecutionManager) CreateIstioComponent(
	executionID *primitive.ObjectID, name string, manifest interface{},
) (*primitive.ObjectID, error) {
	col := executionManager.DB.Collection(collection)
	newID := primitive.NewObjectID()
	rawManifest, _ := json.Marshal(manifest)
	newManifest := &ExecutionManifest{
		ID:       newID,
		Name:     name,
		Manifest: string(rawManifest),
		Status:   ManifestCreated,
	}

	query := bson.M{"_id": executionID}

	updateData := bson.M{
		"$push": bson.M{
			"istiocomponents": newManifest,
		},
	}
	_, err := col.UpdateOne(context.TODO(), query, updateData)

	if err != nil {
		return nil, err
	}

	return &newID, nil
}

func (executionManager *ExecutionManager) CreateUnusedVersion(executionID *primitive.ObjectID, name string) {
	col := executionManager.DB.Collection(collection)

	query := bson.M{"_id": executionID}

	updateData := bson.M{
		"$push": bson.M{
			"undeployedversions": name,
		},
	}

	col.UpdateOne(context.TODO(), query, updateData)
}

func (executionManager *ExecutionManager) FinishExecution(executionID *primitive.ObjectID, status string) {
	col := executionManager.DB.Collection(collection)
	query := bson.M{"_id": executionID}

	updateData := bson.M{
		"$set": bson.M{
			"status":     status,
			"finishtime": time.Now(),
		},
	}
	_, _ = col.UpdateOne(context.TODO(), query, updateData)
}
