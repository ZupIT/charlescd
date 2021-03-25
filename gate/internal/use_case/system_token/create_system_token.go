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

package system_token

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
)

type CreateSystemToken interface {
	Execute(systemToken domain.SystemToken) (domain.SystemToken, error)
}

type createSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewCreateSystemToken(systemTokenRepository repository.SystemTokenRepository) CreateSystemToken {
	return createSystemToken{
		systemTokenRepository: systemTokenRepository,
	}
}

func (createSystemToken createSystemToken) Execute(systemToken domain.SystemToken) (domain.SystemToken, error) {
	savedSystemToken, err := createSystemToken.systemTokenRepository.Create(systemToken)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "createSystemToken.Execute")
	}

	return savedSystemToken, nil
}
