package repository

import (
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"gorm.io/gorm"
)

type UserRepository interface {
	ExistsByEmail(email string) (bool, error)
	GetByEmail(email string) (domain.User, error)
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
		return false, handleUserError("User not found", "repository.UserRepository.FindByEmail", errors.New("user not found"), logging.NotFoundError)
	}

	return true, nil
}


func (userRepository userRepository) GetByEmail(email string) (domain.User, error) {

	var user models.User

	res := userRepository.db.Model(models.SystemToken{}).
		Where("email = ?", email).
		Preload("Permissions").
		First(&user)

	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return domain.User{}, handleUserError("User not found", "unit.GetByEmail.First", res.Error, logging.NotFoundError)
		}
		return domain.User{}, handleSystemTokenError("Find user failed", "unit.GetByEmail.First", res.Error, logging.InternalError)
	}
	return mapper.UserModelToDomain(user), nil
}

func handleUserError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}