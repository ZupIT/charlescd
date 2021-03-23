package domain

import (
	"github.com/google/uuid"
)

type Permission struct {
	ID        uuid.UUID
	Name      string
}
