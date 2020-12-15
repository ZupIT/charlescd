CREATE TABLE SUBSCRIPTIONS
(
    id         varchar(36) PRIMARY KEY,
    url        varchar(256)                        NOT NULL,
    api_key    bytea,
    created_by varchar(100)                        NOT NULL,
    created_at timestamp default clock_timestamp() NOT NULL,
    deleted_by varchar(100),
    deleted_at timestamp
);

CREATE TABLE SUBSCRIPTIONS_EVENTS_EXECUTIONS
(
    id            varchar(36) PRIMARY KEY,
    hook_id       varchar(36)                         NOT NULL,
    execution_log varchar(100),
    event_type    varchar(50),
    event         jsonb                               NOT NULL,
    status        varchar(36)                         NOT NULL,
    created_at    timestamp default clock_timestamp() NOT NULL,
    CONSTRAINT FK_hook_id FOREIGN KEY (hook_id) REFERENCES SUBSCRIPTIONS (ID)
);