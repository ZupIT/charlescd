package queries

const GroupActionQuery = `
				SELECT 	mga.id									AS id,
						mga.nickname 							AS nickname,
						a.nickname          					AS action_type,
       					coalesce (ae.status, 'NOT_EXECUTED')	AS status,
       					ae.started_at 							AS started_at
				FROM metrics_group_actions mga
         			INNER JOIN actions a 			ON mga.action_id = a.id	
					LEFT JOIN actions_executions ae ON mga.id = ae.group_action_id
					WHERE mga.metrics_group_id = ? 
					AND mga.deleted_at IS NULL`
