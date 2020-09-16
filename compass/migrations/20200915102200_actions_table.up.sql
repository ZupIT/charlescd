CREATE TABLE IF NOT EXISTS ACTIONS
(
    ID                   VARCHAR(36) PRIMARY KEY,
    NICKNAME             VARCHAR(100),
    TYPE                 VARCHAR(100),
    CONFIGURATION        JSONB                               NOT NULL,
    EXECUTION_PARAMETERS JSONB                               NOT NULL,
    CREATED_AT           TIMESTAMP DEFAULT clock_timestamp() NOT NULL
)