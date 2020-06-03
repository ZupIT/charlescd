#!/bin/bash
export PGUSER=postgres
export PGPASSWORD=firstpassword
psql -c "CREATE DATABASE charlescd_butler"
psql -c "CREATE USER charlescd_butler WITH PASSWORD '3f2Yq8R4HhDCnefR'"
psql -c "ALTER DATABASE charlescd_butler OWNER TO charlescd_butler"
psql -d charlescd_butler -c "CREATE EXTENSION IF NOT EXISTS pgcrypto"
psql -c "CREATE DATABASE charlescd_moove"
psql -c "CREATE USER charlescd_moove WITH PASSWORD '7Qs2KuM9gYzw48BS'"
psql -c "ALTER DATABASE charlescd_moove OWNER TO charlescd_moove"
psql -d charlescd_moove -c "CREATE EXTENSION IF NOT EXISTS pgcrypto"
psql -c "CREATE DATABASE charlescd_villager"
psql -c "CREATE USER charlescd_villager WITH PASSWORD 'ZkQ67Lnhs2bM3MPN'"
psql -c "ALTER DATABASE charlescd_villager OWNER TO charlescd_villager"
psql -d charlescd_villager -c "CREATE EXTENSION IF NOT EXISTS pgcrypto"
psql -c "CREATE DATABASE keycloak"
psql -c "CREATE USER keycloak WITH PASSWORD 'DCWYW66Mq2ca6w8u'"
psql -c "ALTER DATABASE keycloak OWNER TO keycloak"