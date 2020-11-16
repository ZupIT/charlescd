DROP EXTENSION pgcrypto;
ALTER TABLE data_sources DROP COLUMN data;

ALTER TABLE data_sources ADD COLUMN data jsonb;