package domain

import (
	"github.com/google/uuid"
)

type WorkspacePermission struct {
	ID        uuid.UUID
	Name      string
	Permissions []Permission
}
