ALTER TABLE users
    DROP CONSTRAINT fk_users_system_token_id,
    DROP COLUMN system_token_id;