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
	"github.com/google/uuid"
	"strings"
)

type RegenerateSystemToken interface {
	Execute(id uuid.UUID) (domain.SystemToken, error)
}

type regenerateSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewRegenerateSystemToken(repository repository.SystemTokenRepository) RegenerateSystemToken {
	return regenerateSystemToken{
		systemTokenRepository: repository,
	}
}

func (r regenerateSystemToken) Execute(id uuid.UUID) (domain.SystemToken, error) {
	systemToken, err := r.systemTokenRepository.FindById(id)
	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "RevokeSystemToken.Execute")
	}

	if systemToken.Revoked {
		return domain.SystemToken{}, logging.NewError("Cannot update revoked tokens", logging.CustomError{}, logging.BusinessError, nil)
	}

	systemToken.Token = strings.ReplaceAll(uuid.New().String(), "-", "")

	err = r.systemTokenRepository.Update(systemToken)

	if err != nil {
		return domain.SystemToken{}, logging.WithOperation(err, "RevokeSystemToken.Execute")
	}

	return systemToken, nil
}
