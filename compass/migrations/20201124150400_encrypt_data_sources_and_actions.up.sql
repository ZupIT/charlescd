CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE data_sources RENAME COLUMN data TO deprecated_data;
ALTER TABLE data_sources ALTER COLUMN deprecated_data DROP NOT NULL;

ALTER TABLE data_sources ADD COLUMN data bytea;
ALTER TABLE data_sources ALTER COLUMN data SET NOT NULL;

ALTER TABLE actions RENAME COLUMN configuration TO deprecated_configuration;
ALTER TABLE actions ALTER COLUMN deprecated_configuration DROP NOT NULL;

ALTER TABLE actions ADD COLUMN configuration bytea;
ALTER TABLE actions ALTER COLUMN configuration SET NOT NULL;
