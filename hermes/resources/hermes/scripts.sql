-- Hermes
CREATE TABLE SUBSCRIPTIONS
(
    id         varchar(36) PRIMARY KEY,
    url        varchar(256)                        not null,
    api_key    bytea,
    created_by varchar(100)                        not null,
    created_at timestamp default clock_timestamp() not null,
    deleted_by varchar(100),
    deleted_at timestamp
);

CREATE TABLE SUBSCRIPTIONS_EVENTS_EXECUTIONS
(
    id            varchar(36) PRIMARY KEY,
    hook_id       varchar(36)                         not null,
    execution_log varchar(100),
    event_type    varchar(50),
    event         jsonb                               not null,
    status        varchar(36)                         not null,
    created_at    timestamp default clock_timestamp() not null,
    CONSTRAINT FK_hook_id FOREIGN KEY (hook_id) REFERENCES SUBSCRIPTIONS (ID)
);

-- MOOVE
CREATE TABLE WEBHOOKS_CONFIGURATION
(
    id              varchar(36) PRIMARY KEY,
    workspace_id    varchar(36)                         not null,
    subscription_id varchar(36)                         not null,
    nickname        varchar(100)                        not null,
    description     varchar(100),
    created_by      varchar(100)                        not null,
    created_at      timestamp default clock_timestamp() not null,
    deleted_by      varchar(100)                        not null,
    deleted_at      timestamp default clock_timestamp() not null,
    CONSTRAINT FK_webhook_config_workspace_id FOREIGN KEY (workspace_id) REFERENCES workspaces (ID)
);

CREATE TABLE WEBHOOKS_EVENTS
(
    id    varchar(36) PRIMARY KEY,
    event varchar(50) not null
);

CREATE TABLE WEBHOOKS_CONFIGURATION_EVENTS
(
    webhook_id varchar(36) PRIMARY KEY,
    event_id   varchar(36) PRIMARY KEY,
    CONSTRAINT FK_webhook_event_id FOREIGN KEY (webhook_id) REFERENCES WEBHOOKS_CONFIGURATION (ID),
    CONSTRAINT FK_event_webhook_id FOREIGN KEY (event_id) REFERENCES WEBHOOKS_EVENTS (ID)
);

CREATE TABLE WEBHOOKS_DEAD_LETTER
(
    webhook_id varchar(36) PRIMARY KEY,
    message    jsonb                               not null,
    created_at timestamp default clock_timestamp() not null,
    CONSTRAINT FK_webhook_dead_letter_id FOREIGN KEY (webhook_id) REFERENCES WEBHOOKS_CONFIGURATION (ID)
);


