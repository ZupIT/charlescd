CREATE TABLE IF NOT EXISTS system_tokens_workspaces
(
    system_token_id varchar(36) REFERENCES system_tokens(id),
    workspace_id varchar(36) REFERENCES workspaces(id)
);

ALTER TABLE system_tokens
    DROP COLUMN workspaces;

ALTER TABLE system_tokens
    ADD all_workspaces BOOLEAN NOT NULL default false;