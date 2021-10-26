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

package repository

import (
	"crypto/sha256"
	"fmt"
	"strings"

	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SystemTokenRepository interface {
	Create(systemToken domain.SystemToken) (domain.SystemToken, error)
	FindAll(name string, pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error)
	FindByID(id uuid.UUID) (domain.SystemToken, error)
	FindByToken(token string) (domain.SystemToken, error)
	Update(systemToken domain.SystemToken) error
	UpdateRevokeStatus(systemToken domain.SystemToken) error
	UpdateLastUsedAt(systemToken domain.SystemToken) error
}

type systemTokenRepository struct {
	db *gorm.DB
}

func NewSystemTokenRepository(db *gorm.DB) (SystemTokenRepository, error) {
	return systemTokenRepository{db: db}, nil
}

func (systemTokenRepository systemTokenRepository) Create(systemToken domain.SystemToken) (domain.SystemToken, error) {
	systemToken.ID = uuid.New()
	systemTokenToSave := mapper.SystemTokenDomainToModel(systemToken)

	if err := systemTokenRepository.db.Transaction(
		func(tx *gorm.DB) error {
			res := systemTokenRepository.db.Table("system_tokens").Create(systemTokenMap(systemTokenToSave))
			if res.Error != nil {
				return res.Error
			}

			for _, permission := range systemTokenToSave.Permissions {
				res = systemTokenRepository.db.Table("system_tokens_permissions").Create(insertSystemTokenPermissionsMap(systemTokenToSave.ID, permission.ID))
				if res.Error != nil {
					return res.Error
				}
			}

			for _, workspace := range systemTokenToSave.Workspaces {
				res = systemTokenRepository.db.Table("system_tokens_workspaces").Create(insertSystemTokenWorkspacesMap(systemTokenToSave.ID, workspace.ID))
				if res.Error != nil {
					return res.Error
				}
			}

			return nil
		}); err != nil {
		return domain.SystemToken{}, handleSystemTokenError("Save system token failed", "SystemTokenRepository.Create.Save", err, logging.InternalError)
	}

	return mapper.SystemTokenModelToDomain(systemTokenToSave), nil
}

func (systemTokenRepository systemTokenRepository) FindAll(name string, pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error) {
	var systemTokens []models.SystemToken
	var page = pageRequest

	res := systemTokenRepository.db.Where("revoked = false AND upper(name) like ?", "%"+strings.ToUpper(name)+"%").
		Order(page.Sort).
		Offset(page.Offset()).
		Limit(page.PageSize).
		Preload("Permissions").
		Preload("Workspaces").
		Find(&systemTokens)
	if res.Error != nil {
		return []domain.SystemToken{}, page, handleSystemTokenError("Find all tokens failed", "SystemTokenRepository.FindAll.Find", res.Error, logging.InternalError)
	}

	res = systemTokenRepository.db.Table("system_tokens").
		Where("revoked = false").
		Count(&page.Total)
	if res.Error != nil {
		return []domain.SystemToken{}, page, handleSystemTokenError("Find all tokens failed", "SystemTokenRepository.FindAll.Count", res.Error, logging.InternalError)
	}

	return mapper.SystemTokensModelToDomains(systemTokens), page, nil
}

func (systemTokenRepository systemTokenRepository) FindByID(id uuid.UUID) (domain.SystemToken, error) {
	var systemToken models.SystemToken

	res := systemTokenRepository.db.Model(models.SystemToken{}).
		Where("id = ?", id).
		Preload("Permissions").
		Preload("Workspaces").
		First(&systemToken)

	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return domain.SystemToken{}, handleSystemTokenError("Token not found", "SystemTokenRepository.FindByID.First", res.Error, logging.NotFoundError)
		}
		return domain.SystemToken{}, handleSystemTokenError("Find token failed", "SystemTokenRepository.FindByID.First", res.Error, logging.InternalError)
	}
	return mapper.SystemTokenModelToDomain(systemToken), nil
}

func (systemTokenRepository systemTokenRepository) FindByToken(token string) (domain.SystemToken, error) {
	var systemToken models.SystemToken
	tokenHash := fmt.Sprintf("%x", sha256.Sum256([]byte(token)))

	res := systemTokenRepository.db.Model(models.SystemToken{}).
		Where("token = ?", tokenHash).
		First(&systemToken)

	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return domain.SystemToken{}, handleSystemTokenError("Token not found", "SystemTokenRepository.FindByID.First", res.Error, logging.NotFoundError)
		}
		return domain.SystemToken{}, handleSystemTokenError("Find token failed", "SystemTokenRepository.FindByID.First", res.Error, logging.InternalError)
	}

	return mapper.SystemTokenModelToDomain(systemToken), nil
}

func (systemTokenRepository systemTokenRepository) Update(systemToken domain.SystemToken) error {

	systemTokenToUpdate := mapper.SystemTokenDomainToModel(systemToken)

	if res := systemTokenRepository.db.Table("system_tokens").Where("id = ?", systemToken.ID).
		Updates(systemTokenMap(systemTokenToUpdate)); res.Error != nil {
		return handleSystemTokenError("Update system token failed", "SystemTokenRepository.Update.Updates", res.Error, logging.InternalError)
	}

	return nil
}

func (systemTokenRepository systemTokenRepository) UpdateRevokeStatus(systemToken domain.SystemToken) error {
	res := systemTokenRepository.db.
		Table("system_tokens").
		Where("id = ?", systemToken.ID).
		UpdateColumns(models.SystemToken{Revoked: systemToken.Revoked, RevokedAt: systemToken.RevokedAt})

	if res.Error != nil {
		return handleSystemTokenError("Update system token failed", "SystemTokenRepository.UpdateRevokeStatus.Update", res.Error, logging.InternalError)
	}

	return nil
}

func (systemTokenRepository systemTokenRepository) UpdateLastUsedAt(systemToken domain.SystemToken) error {

	err := systemTokenRepository.db.Table("system_tokens").Where("id = ?", systemToken.ID).Update("last_used_at", systemToken.LastUsedAt)

	if err.Error != nil {
		return handleSystemTokenError("Update system token failed", "SystemTokenRepository.UpdateLastUsedAt.Raw", err.Error, logging.InternalError)
	}

	return nil
}

func handleSystemTokenError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}

func systemTokenMap(systemToken models.SystemToken) map[string]interface{} {
	tokenHash := fmt.Sprintf("%x", sha256.Sum256([]byte(systemToken.Token)))
	return map[string]interface{}{
		"id":             systemToken.ID,
		"name":           systemToken.Name,
		"revoked":        systemToken.Revoked,
		"all_workspaces": systemToken.AllWorkspaces,
		"token":          tokenHash,
		"created_at":     systemToken.CreatedAt,
		"revoked_at":     systemToken.RevokedAt,
		"last_used_at":   systemToken.LastUsedAt,
		"author_email":   systemToken.Author,
	}
}

func insertSystemTokenPermissionsMap(systemTokenID, permissionID uuid.UUID) map[string]interface{} {
	return map[string]interface{}{
		"system_token_id": systemTokenID,
		"permission_id":   permissionID,
	}
}

func insertSystemTokenWorkspacesMap(systemTokenID, workspaceID uuid.UUID) map[string]interface{} {
	return map[string]interface{}{
		"system_token_id": systemTokenID,
		"workspace_id":    workspaceID,
	}
}
