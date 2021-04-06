package mapper

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	gormcrypto "github.com/pkosilo/gorm-crypto"
)

func SystemTokenDomainToModel(systemToken domain.SystemToken, permissions []domain.Permission) models.SystemToken {
	return models.SystemToken{
		ID:          systemToken.ID,
		Name:        systemToken.Name,
		Revoked:     systemToken.Revoked,
		Permissions: PermissionsDomainToModels(permissions),
		Workspaces: systemToken.Workspaces,
		TokenValue: gormcrypto.EncryptedValue{Raw: systemToken.TokenValue},
		CreatedAt:   systemToken.CreatedAt,
		RevokedAt:   systemToken.RevokedAt,
		LastUsedAt:  systemToken.LastUsedAt,
		Author: systemToken.Author,
	}
}

func SystemTokenModelToDomain(systemToken models.SystemToken) domain.SystemToken {
	return domain.SystemToken{
		ID:          systemToken.ID,
		Name:        systemToken.Name,
		Revoked:     systemToken.Revoked,
		Permissions: PermissionsModelToDomains(systemToken.Permissions),
		Workspaces: systemToken.Workspaces,
		TokenValue: systemToken.TokenValue.Raw.(string),
		CreatedAt:   systemToken.CreatedAt,
		RevokedAt:   systemToken.RevokedAt,
		LastUsedAt:  systemToken.LastUsedAt,
		Author: systemToken.Author,
	}
}

func SystemTokensModelToDomains(systemToken []models.SystemToken) []domain.SystemToken {
	systemTokens := make([]domain.SystemToken, 0)
	for _, st := range systemToken {
		systemTokens = append(systemTokens, SystemTokenModelToDomain(st))
	}
	return systemTokens
}
