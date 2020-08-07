package util

import (
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type BaseModel struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
}

func (BaseModel *BaseModel) BeforeCreate(scope *gorm.Scope) error {
	scope.SetColumn("ID", uuid.New())
	return nil
}
