CREATE TABLE IF NOT EXISTS system_tokens(
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    revoked BOOLEAN NOT NULL,
    workspaces JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    last_used_at TIMESTAMP,
    author_id varchar(36) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS system_tokens_permissions(
    system_token_id varchar(36) REFERENCES system_tokens(id),
    permission_id varchar(36) REFERENCES permissions(id)
)