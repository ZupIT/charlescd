package execution

import (
	"octopipe/pkg/utils"

	"github.com/google/uuid"
)

const (
	ManifestCreated     = "CREATED"
	ManifestDeploying   = "DEPLOYING"
	ManifestDeployed    = "DEPLOYED"
	ManifestUndeploying = "UNDEPLOYING"
	ManifestUndeployed  = "UNDEPLOYED"
	ManifestFailed      = "FAILED"
	ManifestExist       = "IS_DEPLOYED"
	ManifestNotFound    = "NOT_FOUND"
)

type DeployedComponentManifest struct {
	utils.BaseModel
	DeployedComponentID uuid.UUID `json:"-"`
	Name                string    `json:"name"`
	Manifest            string    `json:"manifest"`
	Status              string    `json:"status"`
}

type UndeployedComponentManifest struct {
	utils.BaseModel
	UndeployedComponentID uuid.UUID `json:"-"`
	Name                  string    `json:"name"`
	Manifest              string    `json:"manifest"`
	Status                string    `json:"status"`
}

func (executionManager *ExecutionManager) CreateDeployedManifest(manifest *DeployedComponentManifest) (*DeployedComponentManifest, error) {
	row := new(DeployedComponentManifest)
	manifest.Status = ManifestCreated
	res := executionManager.DB.Create(&manifest).Scan(&row)

	if res.Error != nil {
		return nil, res.Error
	}

	return row, nil
}

func (executionManager *ExecutionManager) UpdateDeployedManifestStatus(id uuid.UUID, componentID uuid.UUID, status string) error {
	res := executionManager.DB.Model(&DeployedComponentManifest{}).Where(
		"id = ? AND deployed_component_id = ?", id.String(), componentID.String(),
	).Update("status", status)

	if res.Error != nil {
		return res.Error
	}

	return nil
}

func (executionManager *ExecutionManager) CreateUndeployedManifest(manifest *UndeployedComponentManifest) (*UndeployedComponentManifest, error) {
	row := new(UndeployedComponentManifest)
	manifest.Status = ManifestCreated
	res := executionManager.DB.Create(&manifest).Scan(&row)

	if res.Error != nil {
		return nil, res.Error
	}

	return row, nil
}

func (executionManager *ExecutionManager) UpdateUndeployedManifestStatus(id uuid.UUID, componentID uuid.UUID, status string) error {
	res := executionManager.DB.Model(&UndeployedComponentManifest{}).Where(
		"id = ? AND undeployed_component_id = ?", id.String(), componentID.String(),
	).Update("status", status)

	if res.Error != nil {
		return res.Error
	}

	return nil
}
