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

package systoken

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/google/uuid"
)

type GetSystemToken interface {
	Execute(id uuid.UUID) (domain.SystemToken, error)
}

type getSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewGetSystemToken(repository repository.SystemTokenRepository) GetSystemToken {
	return getSystemToken{
		systemTokenRepository: repository,
	}
}

func (s getSystemToken) Execute(id uuid.UUID) (domain.SystemToken, error) {
	systemToken, err := s.systemTokenRepository.FindByID(id)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "GetSystemToken.Execute")
	}
	return systemToken, nil
}
