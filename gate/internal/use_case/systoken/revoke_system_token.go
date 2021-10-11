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
	"time"

	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository"
	"github.com/google/uuid"
)

type RevokeSystemToken interface {
	Execute(id uuid.UUID) error
}

type revokeSystemToken struct {
	systemTokenRepository repository.SystemTokenRepository
}

func NewRevokeSystemToken(repository repository.SystemTokenRepository) revokeSystemToken {
	return revokeSystemToken{
		systemTokenRepository: repository,
	}
}

func (r revokeSystemToken) Execute(id uuid.UUID) error {
	systemToken, err := r.systemTokenRepository.FindByID(id)

	if err != nil {
		return logging.WithOperation(err, "RevokeSystemToken.Execute")
	}

	if systemToken.Revoked {
		return logging.NewError("Token already revoked.", logging.CustomError{}, logging.BusinessError, nil)
	}

	revokedAt := time.Now()

	systemToken.Revoked = true
	systemToken.RevokedAt = &revokedAt

	updateError := r.systemTokenRepository.UpdateRevokeStatus(systemToken)

	if updateError != nil {
		return logging.WithOperation(updateError, "RevokeSystemToken.Execute")
	}

	return nil
}
