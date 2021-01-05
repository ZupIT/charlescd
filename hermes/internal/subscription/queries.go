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

func FindOneQuery(subscriptionId string) string {
	return fmt.Sprintf(`SELECT external_id, url, description, PGP_SYM_DECRYPT(api_key, '%s')
	FROM SUBSCRIPTIONS
	WHERE  id = '%s'
	AND deleted_at IS NULL`, configuration.GetConfiguration("ENCRYPTION_KEY"), subscriptionId)
}

func FindEventsQuery(subscriptionId string) string {
	return fmt.Sprintf(`SELECT se.event
	FROM subscription_events se
			INNER JOIN subscription_configuration_events sce ON sce.event_id = se.id
	WHERE sce.subscription_id = '%s'`, subscriptionId)
}
