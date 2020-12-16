package subscription

import (
	"fmt"
	"hermes/internal/configuration"
)

const saveSubscriptionQuery = `SELECT ID,
									EXTERNAL_ID,
									URL,
									CREATED_BY,
									CREATED_AT
								FROM SUBSCRIPTIONS
								WHERE ID = ?
  								AND deleted_at IS NULL;`

func Insert(id, externalId, url, createdBy string, apiKey []byte) string {
	return fmt.Sprintf(`INSERT INTO subscriptions (id, external_id, url, api_key, created_by)
				VALUES ('%s', '%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), '%s');`,
		id, externalId, url, apiKey, configuration.GetConfiguration("ENCRYPTION_KEY"), createdBy)
}
