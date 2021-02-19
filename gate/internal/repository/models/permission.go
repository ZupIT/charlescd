package models

import (
	"github.com/google/uuid"
	"time"
)

type Permission struct {
	ID        uuid.UUID
	Name      string
	CreatedAt time.Time
}
