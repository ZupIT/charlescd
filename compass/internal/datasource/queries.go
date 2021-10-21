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

package datasource

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/google/uuid"
)

const datasourceSaveQuery = `SELECT id,
	  							name,
	  							created_at,
	  							workspace_id,
	  							deleted_at,
	  							plugin_src
						FROM data_sources
						WHERE id = ?
						AND deleted_at IS NULL`

var datasourceDecryptedQuery = fmt.Sprintf(`SELECT id,
	  							name,
	  							created_at,
	  							PGP_SYM_DECRYPT(data, '%s'),
	  							workspace_id,
	  							deleted_at,
	  							plugin_src
						FROM data_sources
						WHERE id = ?
						AND deleted_at IS NULL`, configuration.GetConfiguration("ENCRYPTION_KEY"))

const workspaceDatasourceQuery = `SELECT id,
	  							name,
	  							created_at,
	  							workspace_id,
	  							deleted_at,
	  							plugin_src FROM "data_sources" WHERE "workspace_id" = ? AND "deleted_at" IS NULL`

func Insert(id, name, pluginSrc string, data []byte, workspaceID uuid.UUID) string {
	return fmt.Sprintf(`INSERT INTO data_sources (id, name, data, workspace_id, deleted_at, plugin_src)
							VALUES ('%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), '%s', null, '%s');`,
		id, name, data, configuration.GetConfiguration("ENCRYPTION_KEY"), workspaceID, pluginSrc)
}
