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

var decryptedWorkspaceAndIdActionQuery = fmt.Sprintf(`SELECT id,
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

func Insert(id, nickname, actionType, description string, config []byte, workspaceId uuid.UUID) string {
	return fmt.Sprintf(`INSERT INTO actions (id, workspace_id, nickname, type, description, configuration, deleted_at)
			VALUES ('%s', '%s', '%s', '%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), null);`,
		id, workspaceId, nickname, actionType, description, config, configuration.GetConfiguration("ENCRYPTION_KEY"))
}
