package repository

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	ExistsByEmail(email string) (bool, error)
}

type userRepository struct {
	db      *gorm.DB
}

func NewUserRepository(db *gorm.DB) (UserRepository, error) {
	return userRepository{db: db}, nil
}

func (userRepository userRepository) ExistsByEmail(email string) (bool, error) {
	var count int64

	res := userRepository.db.Model(models.User{}).Where("email = ?", email).Count(&count)
	if res.Error != nil {
		return false, handleUserError("Find user by email failed", "repository.UserRepository.FindByEmail", res.Error, logging.InternalError)
	}

	if count < 1 {
		return false, handleUserError("User not found", "repository.UserRepository.FindByEmail", res.Error, logging.NotFoundError)
	}

	return true, nil
}

func handleUserError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}