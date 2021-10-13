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
)

type GetAllSystemToken interface {
	Execute(name string, pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error)
}

type getAllSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewGetAllSystemToken(r repository.SystemTokenRepository) GetAllSystemToken {
	return getAllSystemToken{
		systemTokenRepository: r,
	}
}

func (f getAllSystemToken) Execute(name string, pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error) {
	systemTokens, page, err := f.systemTokenRepository.FindAll(name, pageRequest)
	if err != nil {
		return []domain.SystemToken{}, page, logging.WithOperation(err, "getAllSystemToken.Execute")
	}

	return systemTokens, page, nil
}
