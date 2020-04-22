postgresqlPassword: "${postgres_password}"
initdbScripts:
  my_init_script.sql: |
    CREATE DATABASE charlesmoove;
    CREATE USER charlesmoove WITH PASSWORD '${charlesmoove_password}';
    GRANT ALL PRIVILEGES ON DATABASE charlesmoove TO charlesmoove;

    CREATE DATABASE charlesnotifications;
    CREATE USER charlesnotifications WITH PASSWORD '${charlesnotifications_password}';
    GRANT ALL PRIVILEGES ON DATABASE charlesnotifications TO charlesnotifications;

