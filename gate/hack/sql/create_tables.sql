CREATE TABLE IF NOT EXISTS users(
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    photo_url VARCHAR(64),
    created_at TIMESTAMP NOT NULL,
    is_root BOOLEAN NOT NULL
);
---
CREATE TABLE IF NOT EXISTS permissions(
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
---
CREATE TABLE IF NOT EXISTS workspaces(
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64) NOT NULL
);
---
INSERT INTO permissions(id, name, created_at) values('09ae6a9a-45d6-44de-8b3a-5a00d15e98af','maintenance_write', now());
INSERT INTO permissions(id, name, created_at) values('7cc71f53-2054-4193-836d-6177fa9bbb48','deploy_write', now());
INSERT INTO permissions(id, name, created_at) values('70f30948-d8fc-448a-9e3e-050c16a4eb46','circle_read', now());
INSERT INTO permissions(id ,name, created_at) values('d138ff33-0fb8-4ebf-8c8c-20d61067b183', 'circle_write', now());
insert into users(id, name, photo_url, email, created_at, is_root) values('c7e6dafe-aa7a-4536-be1b-34eaad4c2915', 'Charles Admin', null, 'charlesadmin@admin', now(), true);
INSERT INTO workspaces(id ,name) values('d138ff33-0fb8-4ebf-8c8c-20d61067b183', 'charles');