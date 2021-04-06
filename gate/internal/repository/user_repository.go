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
		return false, handleUserError("Find user by email failed", "UserRepository.ExistsByEmail.Count", res.Error, logging.InternalError)
	}

	if count < 1 {
		return false, nil
	}

	return true, nil
}

func handleUserError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}