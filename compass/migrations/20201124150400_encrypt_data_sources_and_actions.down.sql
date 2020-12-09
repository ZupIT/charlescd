DROP EXTENSION pgcrypto;

ALTER TABLE data_sources DROP COLUMN data;
ALTER TABLE data_sources RENAME COLUMN deprecated_data TO data;
ALTER TABLE data_sources ALTER COLUMN data SET NOT NULL;

ALTER TABLE actions DROP COLUMN configuration;
ALTER TABLE actions RENAME COLUMN deprecated_configuration TO configuration;
ALTER TABLE actions ALTER COLUMN configuration SET NOT NULL;
