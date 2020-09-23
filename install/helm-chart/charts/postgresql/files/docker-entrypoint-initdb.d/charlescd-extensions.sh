#!/bin/bash
export PGUSER=postgres
export PGPASSWORD=CHANGEME
psql -c "CREATE DATABASE charlescd_butler"
psql -c "CREATE USER charlescd_butler WITH PASSWORD 'CHANGEME'"
psql -c "ALTER DATABASE charlescd_butler OWNER TO charlescd_butler"
psql -d charlescd_butler -c "CREATE EXTENSION IF NOT EXISTS pgcrypto"
psql -c "CREATE DATABASE charlescd_moove"
psql -c "CREATE USER charlescd_moove WITH PASSWORD 'CHANGEME'"
psql -c "ALTER DATABASE charlescd_moove OWNER TO charlescd_moove"
psql -d charlescd_moove -c "CREATE EXTENSION IF NOT EXISTS pgcrypto"
psql -c "CREATE DATABASE charlescd_villager"
psql -c "CREATE USER charlescd_villager WITH PASSWORD 'CHANGEME'"
psql -c "ALTER DATABASE charlescd_villager OWNER TO charlescd_villager"
psql -d charlescd_villager -c "CREATE EXTENSION IF NOT EXISTS pgcrypto"
psql -c "CREATE DATABASE keycloak"
psql -c "CREATE USER keycloak WITH PASSWORD 'CHANGEME'"
psql -c "ALTER DATABASE keycloak OWNER TO keycloak"

psql -c "CREATE DATABASE charlescd_compass"
psql -c "CREATE USER charlescd_compass WITH PASSWORD 'CHANGEME'"
psql -c "ALTER DATABASE charlescd_compass OWNER TO charlescd_compass"
psql -d charlescd_compass -c "CREATE EXTENSION IF NOT EXISTS pgcrypto"
