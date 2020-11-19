ALTER TABLE actions DROP COLUMN configuration;

ALTER TABLE actions ADD COLUMN configuration jsonb;