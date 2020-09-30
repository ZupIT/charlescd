CREATE TABLE IF NOT EXISTS ACTIONS
(
    ID            VARCHAR(36) PRIMARY KEY,
    WORKSPACE_ID  VARCHAR(36),
    NICKNAME      VARCHAR(100),
    TYPE          VARCHAR(100),
    DESCRIPTION   VARCHAR(100),
    CONFIGURATION JSONB                               NOT NULL,
    CREATED_AT    TIMESTAMP DEFAULT clock_timestamp() NOT NULL,
    DELETED_AT    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS METRICS_GROUP_ACTIONS
(
    ID                   VARCHAR(36) PRIMARY KEY,
    METRICS_GROUP_ID     VARCHAR(36)                         NOT NULL,
    ACTION_ID            VARCHAR(36)                         NOT NULL,
    NICKNAME             VARCHAR(100)                        NOT NULL,
    EXECUTION_PARAMETERS JSONB                               NOT NULL,
    CREATED_AT           TIMESTAMP DEFAULT clock_timestamp() NOT NULL,
    DELETED_AT           TIMESTAMP,
    CONSTRAINT fk_metric_group_action FOREIGN KEY (METRICS_GROUP_ID) REFERENCES METRICS_GROUPS (ID),
    CONSTRAINT fk_action_metric_group_action FOREIGN KEY (ACTION_ID) REFERENCES ACTIONS (ID)
);

