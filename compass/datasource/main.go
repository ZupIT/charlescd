package datasource

import (
	"github.com/jinzhu/gorm"
)

type UseCases interface {
	// Parse(dataSource io.ReadCloser) (DataSource, error)
	FindAllByWorkspace(workspaceID string) ([]DataSource, error)
	// Save(dataSource DataSource) (DataSource, error)
	// FindById(id string) (DataSource, error)
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
