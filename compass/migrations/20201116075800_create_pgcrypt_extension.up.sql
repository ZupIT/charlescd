CREATE EXTENSION IF NOT EXISTS pgcrypto;

DELETE FROM data_sources;

ALTER TABLE data_sources DROP COLUMN data;

ALTER TABLE data_sources ADD COLUMN data bytea;
