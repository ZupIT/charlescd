package repository

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"gorm.io/gorm"
)

type WorkspaceRepository interface {
	CountByIds(workspaceIds []string) (int64, error)
}

type workspaceRepository struct {
	db      *gorm.DB
}

func NewWorkspaceRepository(db *gorm.DB) (WorkspaceRepository, error) {
	return workspaceRepository{db: db}, nil
}

func (workspaceRepository workspaceRepository) CountByIds(workspaceIds []string) (int64, error) {
	var count int64

	res := workspaceRepository.db.Table("workspaces").Where("id IN ?", workspaceIds).Count(&count)

	if res.Error != nil {
		return 0, handleWorkspaceError("Find all workspaces failed", "WorkspaceRepository.CountByIds.Count", res.Error, logging.InternalError)
	}

	return count, nil
}

func handleWorkspaceError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}