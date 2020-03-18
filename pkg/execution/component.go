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

func (executionManager *ExecutionManager) CreateComponent(component *DeployedComponent) (*DeployedComponent, error) {
	row := new(DeployedComponent)
	res := executionManager.DB.Create(&component).Scan(&row)

	if res.Error != nil {
		return nil, res.Error
	}

	return row, nil
}
