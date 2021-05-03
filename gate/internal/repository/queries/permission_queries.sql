-- name: find-permissions-by-system-token-id
select id,
       name,
       created_at
from permissions p
         inner join system_tokens_permissions stp on
    p.id = stp.permission_id
where stp.system_token_id = ?
