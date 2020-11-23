CREATE EXTENSION IF NOT EXISTS pgcrypto;

DELETE FROM actions_configurations;
DELETE FROM metrics_group_actions;
DELETE FROM actions_executions;
DELETE FROM actions;
DELETE FROM metric_executions;
DELETE FROM metric_group_bies;
DELETE FROM metrics;
DELETE FROM metrics_groups;
DELETE FROM data_sources;

ALTER TABLE data_sources DROP COLUMN data;

ALTER TABLE data_sources ADD COLUMN data bytea;
