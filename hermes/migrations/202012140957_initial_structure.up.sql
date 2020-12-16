CREATE TABLE SUBSCRIPTIONS
(
    id          varchar(36) PRIMARY KEY,
    external_id varchar(36)                         NOT NULL,
    url         varchar(256)                        NOT NULL,
    api_key     bytea,
    created_by  varchar(100)                        NOT NULL,
    created_at  timestamp default clock_timestamp() NOT NULL,
    deleted_by  varchar(100),
    deleted_at  timestamp
);

CREATE TABLE SUBSCRIPTIONS_EVENTS_EXECUTIONS
(
    id              varchar(36) PRIMARY KEY,
    subscription_id varchar(36)                         NOT NULL,
    execution_log   varchar(100),
    event_type      varchar(50),
    event           jsonb                               NOT NULL,
    status          varchar(36)                         NOT NULL,
    created_at      timestamp default clock_timestamp() NOT NULL,
    CONSTRAINT FK_subscription_id_events_executions FOREIGN KEY (subscription_id) REFERENCES SUBSCRIPTIONS (ID)
);

CREATE TABLE SUBSCRIPTION_EVENTS
(
    id    varchar(36) PRIMARY KEY,
    event varchar(50) NOT NULL
);

CREATE TABLE SUBSCRIPTION_CONFIGURATION_EVENTS
(
    subscription_id varchar(36) PRIMARY KEY,
    event_id        varchar(36) PRIMARY KEY,
    CONSTRAINT FK_subscription_id_configuration_event FOREIGN KEY (subscription_id) REFERENCES SUBSCRIPTIONS (ID),
    CONSTRAINT FK_event_id_configuration_event FOREIGN KEY (event_id) REFERENCES SUBSCRIPTION_EVENTS (ID)
);