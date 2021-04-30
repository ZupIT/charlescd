ALTER TABLE users
    ADD COLUMN system_token_id varchar(36),
    ADD CONSTRAINT fk_users_system_token_id FOREIGN KEY (system_token_id) REFERENCES system_tokens (id);