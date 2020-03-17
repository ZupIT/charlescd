package execution

import (
	"octopipe/pkg/utils"

	"github.com/google/uuid"
)

const (
	IstioComponentDeploying = "DEPLOYING"
	IstioComponentDeployed  = "DEPLOYED"
	IstioComponentFailed    = "FAILED"
)

type IstioComponent struct {
	utils.BaseModel
	ExecutionID uuid.UUID `json:"-"`
	Name        string    `json:"name"`
	Manifest    string    `json:"manifest"`
	Status      string    `json:"status"`
}
