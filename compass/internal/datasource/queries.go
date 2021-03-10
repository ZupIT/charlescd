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


func Insert(id, name, pluginSrc string, data []byte, workspaceId uuid.UUID) string {
	return fmt.Sprintf(`INSERT INTO data_sources (id, name, data, workspace_id, deleted_at, plugin_src)
							VALUES ('%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), '%s', null, '%s');`,
		id, name, data, configuration.GetConfiguration("ENCRYPTION_KEY"), workspaceId, pluginSrc)
}
