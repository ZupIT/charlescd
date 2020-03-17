package execution

import (
	"octopipe/pkg/utils"

	"github.com/google/uuid"
)

type DeployedComponent struct {
	utils.BaseModel
	ExecutionID uuid.UUID                   `json:"-"`
	Name        string                      `json:"name"`
	ImageURL    string                      `json:"imageURL"`
	Manifests   []DeployedComponentManifest `json:"manifests"`
}
