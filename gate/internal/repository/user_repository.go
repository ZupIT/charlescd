/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package repository

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository interface {
	ExistsByEmail(email string) (bool, error)
	GetByEmail(email string) (domain.User, error)
	Create(user domain.User) (domain.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) (UserRepository, error) {
	return userRepository{db: db}, nil
}

func (userRepository userRepository) ExistsByEmail(email string) (bool, error) {
	var count int64

	res := userRepository.db.Model(models.User{}).Where("email = ?", email).Count(&count)
	if res.Error != nil {
		return false, handleUserError("Find user by email failed", "UserRepository.ExistsByEmail.Count", res.Error, logging.InternalError)
	}

	if count < 1 {
		return false, nil
	}

	return true, nil
}

func (userRepository userRepository) GetByEmail(email string) (domain.User, error) {
	var user models.User

	res := userRepository.db.Model(models.User{}).
		Where("email = ?", email).
		First(&user)

	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return domain.User{}, handleUserError("User not found", "unit.GetByEmail.First", res.Error, logging.NotFoundError)
		}
		return domain.User{}, handleUserError("Find user failed", "UserRepository.GetByEmail.First", res.Error, logging.InternalError)
	}
	return mapper.UserModelToDomain(user), nil
}

func (userRepository userRepository) Create(user domain.User) (domain.User, error) {
	user.ID = uuid.New()
	userToSave := mapper.UserDomainToModel(user)

	res := userRepository.db.Model(models.User{}).Create(&userToSave)

	if res.Error != nil {
		return domain.User{}, handleUserError("Create user failed", "UserRepository.Create.create", res.Error, logging.InternalError)
	}
	return mapper.UserModelToDomain(userToSave), nil
}

func handleUserError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}
