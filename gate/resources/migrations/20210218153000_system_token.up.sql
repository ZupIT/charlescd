CREATE TABLE IF NOT EXISTS system_tokens(
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    revoked BOOLEAN NOT NULL,
    workspaces VARCHAR(36)[] NOT NULL,
    created_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    last_used_at TIMESTAMP,
    author_email varchar(128) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS system_tokens_permissions(
    system_token_id varchar(36) REFERENCES system_tokens(id),
    permission_id varchar(36) REFERENCES permissions(id)
)