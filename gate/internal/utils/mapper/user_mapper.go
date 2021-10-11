/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package mapper

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
)

func UserModelToDomain(user models.User) domain.User {
	return domain.User{
		ID:            user.ID,
		Name:          user.Name,
		PhotoURL:      user.PhotoURL,
		Email:         user.Email,
		IsRoot:        user.IsRoot,
		SystemTokenID: user.SystemTokenID,
		CreatedAt:     user.CreatedAt,
	}
}

func UserDomainToModel(user domain.User) models.User {
	return models.User{
		ID:            user.ID,
		Name:          user.Name,
		PhotoURL:      user.PhotoURL,
		Email:         user.Email,
		IsRoot:        user.IsRoot,
		SystemTokenID: user.SystemTokenID,
		CreatedAt:     user.CreatedAt,
	}
}
