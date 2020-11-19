package action

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

const decryptedWorkspaceAndIdActionQuery = `SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at,
						PGP_SYM_DECRYPT(configuration, 'MAYCON')
					FROM actions
					WHERE id = ?
					AND workspace_id = ?
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
