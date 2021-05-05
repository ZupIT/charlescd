ALTER TABLE system_tokens
    ADD workspaces VARCHAR(36)[] NOT NULL default [];

ALTER TABLE system_tokens
    DROP COLUMN all_workspaces;

DROP TABLE system_tokens_workspace;