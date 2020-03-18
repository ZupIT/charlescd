package execution

import (
	"octopipe/pkg/utils"

	"github.com/google/uuid"
)

type IstioComponent struct {
	utils.BaseModel
	ExecutionID uuid.UUID `json:"-"`
	Name        string    `json:"name"`
	Manifest    string    `json:"manifest"`
	Status      string    `json:"status"`
}

func (executionManager *ExecutionManager) CreateIstioComponent(component *IstioComponent) (*IstioComponent, error) {
	row := new(IstioComponent)
	component.Status = ManifestDeploying
	res := executionManager.DB.Create(&component).Scan(&row)

	if res.Error != nil {
		return nil, res.Error
	}

	return row, nil
}

func (executionManager *ExecutionManager) UpdateIstioComponentStatus(id uuid.UUID, executionID uuid.UUID, status string) error {
	res := executionManager.DB.Model(&IstioComponent{}).Where(
		"id = ? AND execution_id = ?", id.String(), executionID.String(),
	).Update("status", status)

	if res.Error != nil {
		return res.Error
	}

	return nil
}
