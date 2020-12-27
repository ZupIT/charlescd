package subscription

import (
	"fmt"
	"github.com/google/uuid"
	"gorm.io/gorm/clause"
	"hermes/internal/configuration"
)

func InsertMap(id, externalId uuid.UUID, url, description, apiKey, createdBy string) map[string]interface{} {
	return map[string]interface{}{
		"id":          id,
		"ExternalId":  externalId,
		"Url":         url,
		"Description": description,
		"ApiKey": clause.Expr{
			SQL: `PGP_SYM_ENCRYPT(?,?,'cipher-algo=aes256')`,
			Vars: []interface{}{
				fmt.Sprintf("%s", apiKey),
				fmt.Sprintf("%s", configuration.GetConfiguration("ENCRYPTION_KEY")),
			},
		},
		"CreatedBy": createdBy,
	}

}
