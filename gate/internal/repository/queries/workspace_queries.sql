-- name: find-user-permissions-at-workspace
select wug.permissions
from workspaces w
         inner join workspaces_user_groups wug on wug.workspace_id = ?
         inner join user_groups ug on ug.id = wug.user_group_id
         inner join user_groups_users ugu on ugu.user_group_id = ug.id
         inner join users u on ? = ugu.user_id