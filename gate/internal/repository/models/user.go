package models

import (
	"github.com/google/uuid"
	"time"
)

type User struct {
	ID        uuid.UUID
	Name      string
	PhotoUrl  string
	Email     string
	IsRoot    bool
	CreatedAt time.Time
}
