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

var decryptedSubscriptionQuery = fmt.Sprintf(`SELECT id,
						description,
       					external_id,
       					url,
						PGP_SYM_DECRYPT(api_key, '%s'),
						events
					FROM subscriptions
					WHERE id = ?
					AND deleted_at IS NULL`, "Yjg0NDVkMDUtMzliOC00YTkxLWEwOWMtZDRhN2VkOGRlZmRj")

