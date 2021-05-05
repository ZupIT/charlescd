-- name: find-user-permissions-at-workspace
select workspaces_user_groups.permissions as workspace_user_group_permissions
from users
         left join user_groups_users on users.id = user_groups_users.user_id
         left join user_groups on user_groups_users.user_group_id = user_groups.id
         left join workspaces_user_groups on user_groups.id = workspaces_user_groups.user_group_id
         left join workspaces on workspaces_user_groups.workspace_id = workspaces.id and
                                 (workspaces_user_groups.permissions @> '[{"name": "maintenance_write"}]'
                                      and workspaces.status in ('INCOMPLETE', 'COMPLETE')
                                     or workspaces.status = 'COMPLETE')
        where workspaces.id = ?
        and users.id = ?;

-- name: find-workspaces-by-system-token-id
SELECT id,
       name,
       created_at
FROM workspaces w
         INNER JOIN system_tokens_workspaces stw ON
    w.id = stw.workspace_id
WHERE stw.system_token_id = ?;