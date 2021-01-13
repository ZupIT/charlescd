package subscription

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"gorm.io/gorm/clause"
	"hermes/internal/configuration"
)

func InsertMap(id, externalId uuid.UUID, url, description, apiKey, createdBy string, events json.RawMessage) map[string]interface{} {
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
		"Events":    string(events),
		"CreatedBy": createdBy,
	}

}

func FindOneQuery(subscriptionId string) string {
	return fmt.Sprintf(`SELECT external_id, url, description, events
	FROM SUBSCRIPTIONS
	WHERE  id = '%s'
	AND deleted_at IS NULL`, subscriptionId)
}
