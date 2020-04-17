package utils

import (
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type BaseModel struct {
	ID uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
}

func (b *BaseModel) BeforeCreate(scope *gorm.Scope) error {
	scope.SetColumn("ID", uuid.New())
	return nil
}
