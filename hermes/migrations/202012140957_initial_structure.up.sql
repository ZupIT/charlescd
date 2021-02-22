CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE SUBSCRIPTIONS
(
    id          varchar(36)                         PRIMARY KEY,
    description varchar(256)                        NOT NULL,
    external_id varchar(36)                         NOT NULL,
    url         varchar(256)                        NOT NULL,
    api_key     bytea,
    events      text[]                              NOT NULL,
    created_by  varchar(100)                        NOT NULL,
    created_at  timestamp default clock_timestamp() NOT NULL,
    deleted_by  varchar(100),
    deleted_at  timestamp
);

CREATE TABLE MESSAGES
(
    id              varchar(36)                          PRIMARY KEY,
    subscription_id varchar(36)                          NOT NULL,
    event_type      varchar(50),
    last_status     varchar(50),
    event           jsonb                                NOT NULL,
    created_at      timestamp default clock_timestamp()  NOT NULL,
    CONSTRAINT FK_subscription_id_messages_executions FOREIGN KEY (subscription_id) REFERENCES SUBSCRIPTIONS (ID)
);

CREATE TABLE MESSAGES_EXECUTIONS_HISTORIES
(
    id            varchar(36)                         PRIMARY KEY,
    execution_id  varchar(36)                         NOT NULL,
    execution_log varchar(100),
    status        varchar(36)                         NOT NULL,
    http_status   int,
    logged_at     timestamp default clock_timestamp() NOT NULL,
    CONSTRAINT FK_execution_id_history FOREIGN KEY (execution_id) REFERENCES MESSAGES (ID)
);