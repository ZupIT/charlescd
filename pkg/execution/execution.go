package execution

import (
	"octopipe/pkg/utils"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type ExecutionManager struct {
	DB *gorm.DB
}

type UseCases interface {
}

const (
	ExecutionWaiting  = "WAITING"
	ExecutionRunning  = "RUNNING"
	ExecutionFailed   = "FAILED"
	ExecutionFinished = "FINISHED"
)

type Execution struct {
	utils.BaseModel
	Name               string              `json:"name"`
	Namespace          string              `json:"namespace"`
	DeployedComponents []DeployedComponent `json:"deployedComponents"`
	Author             string              `json:"author"`
	StartTime          time.Time           `json:"startTime"`
	FinishTime         time.Time           `json:"finishTime"`
	Webhook            string              `json:"webhook"`
	Status             string              `json:"status"`
	HelmURL            string              `json:"helmUrl"`
	Error              string              `json:"error"`
}

type ExecutionListItem struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	Namespace  string    `json:"namespace"`
	StartTime  time.Time `json:"startTime"`
	FinishTime time.Time `json:"finishTime"`
	Status     string    `json:"status"`
}

func NewExecutionManager(db *gorm.DB) *ExecutionManager {
	return &ExecutionManager{db}
}

func (executionManager *ExecutionManager) FindAll() (*[]ExecutionListItem, error) {
	executions := &[]ExecutionListItem{}

	res := executionManager.DB.Table("executions").Select([]string{
		"id",
		"name",
		"namespace",
		"status",
		"start_time",
		"finish_time",
	}).Find(&executions)
	if res.Error != nil {
		return nil, res.Error
	}

	return executions, nil
}

func (executionManager *ExecutionManager) FindByID(id string) (*Execution, error) {
	execution := &Execution{}

	res := executionManager.DB.Preload("DeployedComponents").Preload("DeployedComponents.Manifests").First(&execution, "id = ?", id)
	if res.Error != nil {
		return nil, res.Error
	}

	return execution, nil
}

func (executionManager *ExecutionManager) Create(execution *Execution) (*Execution, error) {
	row := new(Execution)
	execution.Status = ExecutionWaiting
	res := executionManager.DB.Create(&execution).Scan(&row)

	if res.Error != nil {
		return nil, res.Error
	}

	return row, nil
}

func (executionManager *ExecutionManager) UpdateStatus(executionID string, status string) error {
	res := executionManager.DB.Model(&Execution{}).Where("id = ?", executionID).Update("status", status)

	if res.Error != nil {
		return res.Error
	}

	return nil
}

func (executionManager *ExecutionManager) FinishExecution(executionID string) error {
	updateData := map[string]interface{}{"status": ExecutionFinished, "finish_time": time.Now()}
	res := executionManager.DB.Model(&Execution{}).Where("id = ?", executionID).Updates(updateData)

	if res.Error != nil {
		return res.Error
	}

	return nil
}
