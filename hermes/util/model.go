package util

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type BaseModel struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
}

func (baseModel *BaseModel) BeforeCreate(scope *gorm.DB) error {
	baseModel.ID = uuid.New()
	return nil
}