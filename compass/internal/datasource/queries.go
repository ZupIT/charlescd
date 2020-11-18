package datasource

const datasourceSaveQuery = `SELECT id,
	  							name,
	  							created_at,
	  							workspace_id,
	  							health,
	  							deleted_at,
	  							plugin_src
						FROM data_sources
						WHERE id = ?
						AND deleted_at IS NULL`

const datasourceDecryptedQuery = `SELECT id,
	  							name,
	  							created_at,
	  							PGP_SYM_DECRYPT(data, 'MAYCON'),
	  							workspace_id,
	  							health,
	  							deleted_at,
	  							plugin_src
						FROM data_sources
						WHERE id = ?
						AND deleted_at IS NULL`

const workspaceDatasourceQuery = `SELECT id,
	  							name,
	  							created_at,
	  							workspace_id,
	  							health,
	  							deleted_at,
	  							plugin_src FROM "data_sources" WHERE "workspace_id" = ? AND "deleted_at" IS NULL`

const workspaceAndHealthDatasourceQuery = `SELECT id,
												name,
	  											created_at,
	  											workspace_id,
	  											health,
	  											plugin_src
											FROM data_sources
											WHERE workspace_id = ?
											AND health = ?`

const decryptedWorkspaceAndHealthDatasourceQuery = `SELECT id,
	  												name,
	  												created_at,
	  												PGP_SYM_DECRYPT(data, 'MAYCON'),
	  												workspace_id,
	  												health,
	  												deleted_at,
	  												plugin_src
												FROM data_sources
												WHERE workspace_id = ?
												AND health = ?`
