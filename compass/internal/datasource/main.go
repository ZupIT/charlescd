package datasource

import (
	"github.com/jinzhu/gorm"
)

type UseCases interface {
	// Parse(dataSource io.ReadCloser) (DataSource, error)
	FindAllByWorkspace(workspaceID string) ([]DataSource, error)
	Delete(id string, workspaceID string) error
	// Save(dataSource DataSource) (DataSource, error)
	SetAsHealth(id string, workspaceID string) error
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
