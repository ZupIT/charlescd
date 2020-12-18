package subscription

import (
	"fmt"
	"hermes/internal/configuration"
)

func Insert(id, description, externalId, url, createdBy string, apiKey []byte) string {
	return fmt.Sprintf(`INSERT INTO subscriptions (id, description, external_id, url, api_key, created_by)
				VALUES ('%s', '%s', '%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), '%s');`,
		id, description, externalId, url, apiKey, configuration.GetConfiguration("ENCRYPTION_KEY"), createdBy)
}
