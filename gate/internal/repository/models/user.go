package models

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
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

func UserDomainToModel(user domain.User) User {
	return User{
		ID:        user.ID,
		Name:      user.Name,
		PhotoUrl:  user.PhotoUrl,
		Email:     user.Email,
		IsRoot:    user.IsRoot,
		CreatedAt: user.CreatedAt,
	}
}
