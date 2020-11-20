package action

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
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
					AND deleted_at IS NULL`, configuration.GetConfiguration("PV_KEY"))

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
					AND deleted_at IS NULL`, configuration.GetConfiguration("PV_KEY"))
