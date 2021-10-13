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

package action

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/google/uuid"
)

const actionQuery = `SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at
					FROM actions
					WHERE id = ?
					AND deleted_at IS NULL`

const workspaceActionQuery = `SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at
					FROM actions
					WHERE workspace_id = ?
					AND deleted_at IS NULL`

var decryptedWorkspaceAndIDActionQuery = fmt.Sprintf(`SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at,
						PGP_SYM_DECRYPT(configuration, '%s')
					FROM actions
					WHERE id = ?
					AND workspace_id = ?
					AND deleted_at IS NULL`, configuration.GetConfiguration("ENCRYPTION_KEY"))

var idActionQuery = fmt.Sprintf(`SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at,
						PGP_SYM_DECRYPT(configuration, '%s')
					FROM actions
					WHERE id = ?
					AND deleted_at IS NULL`, configuration.GetConfiguration("ENCRYPTION_KEY"))

func Insert(id, nickname, actionType, description string, config []byte, workspaceID uuid.UUID) string {
	return fmt.Sprintf(`INSERT INTO actions (id, workspace_id, nickname, type, description, configuration, deleted_at)
			VALUES ('%s', '%s', '%s', '%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), null);`,
		id, workspaceID, nickname, actionType, description, config, configuration.GetConfiguration("ENCRYPTION_KEY"))
}
