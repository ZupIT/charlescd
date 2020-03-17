package execution

import (
	"octopipe/pkg/utils"

	"github.com/google/uuid"
)

const (
	ManifestDeploying = "DEPLOYING"
	ManifestDeployed  = "DEPLOYED"
	ManifestFailed    = "FAILED"
)

type DeployedComponentManifest struct {
	utils.BaseModel
	DeployedComponentID uuid.UUID `json:"-"`
	Name                string    `json:"name"`
	Manifest            string    `json:"manifest"`
	Status              string    `json:"status"`
}
