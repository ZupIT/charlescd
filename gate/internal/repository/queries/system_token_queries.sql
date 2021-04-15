-- name: find-system-token-from-token
select *
from (
         select id,
                name,
                revoked,
                all_workspaces,
                created_at,
                revoked_at,
                last_used_at,
                author_email,
                pgp_sym_decrypt(token::bytea, '64971923d21a4887a3acf1ad15961bbc',
                                'cipher-algo=aes256') as token_decrypted
         from system_tokens) as st
where token_decrypted = ?