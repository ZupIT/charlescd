package execution

import (
	"octopipe/pkg/utils"

	"github.com/google/uuid"
)

const (
	ManifestDeploying = "DEPLOYING"
	ManifestDeployed  = "DEPLOYED"
	ManifestFailed    = "FAILED"
	ManifestExist     = "IS_DEPLOYED"
)

type DeployedComponentManifest struct {
	utils.BaseModel
	DeployedComponentID uuid.UUID `json:"-"`
	Name                string    `json:"name"`
	Manifest            string    `json:"manifest"`
	Status              string    `json:"status"`
}

func (executionManager *ExecutionManager) CreateManifest(manifest *DeployedComponentManifest) (*DeployedComponentManifest, error) {
	row := new(DeployedComponentManifest)
	manifest.Status = ManifestDeploying
	res := executionManager.DB.Create(&manifest).Scan(&row)

	if res.Error != nil {
		return nil, res.Error
	}

	return row, nil
}

func (executionManager *ExecutionManager) UpdateManifestStatus(id uuid.UUID, componentID uuid.UUID, status string) error {
	res := executionManager.DB.Model(&DeployedComponentManifest{}).Where(
		"id = ? AND deployed_component_id = ?", id.String(), componentID.String(),
	).Update("status", status)

	if res.Error != nil {
		return res.Error
	}

	return nil
}
