postgresqlPassword: "${postgres_password}"
initdbScripts:
  my_init_script.sql: |
    CREATE DATABASE ${db-notifications-username};
    CREATE USER ${db-notifications-username} WITH PASSWORD '${db-notifications-password}';
    GRANT ALL PRIVILEGES ON DATABASE ${db-notifications-username} TO ${db-notifications-username};

    CREATE DATABASE ${db-deploy-username};
    CREATE USER ${db-deploy-username} WITH PASSWORD '${db-deploy-password}';
    GRANT ALL PRIVILEGES ON DATABASE ${db-deploy-username} TO ${db-deploy-username};

    CREATE DATABASE ${db-circle-matcher-username};
    CREATE USER ${db-circle-matcher-username} WITH PASSWORD '${db-circle-matcher-password}';
    GRANT ALL PRIVILEGES ON DATABASE ${db-circle-matcher-username} TO ${db-circle-matcher-username};

    CREATE DATABASE ${db-moove-username};
    CREATE USER ${db-moove-username} WITH PASSWORD '${db-moove-password}';
    GRANT ALL PRIVILEGES ON DATABASE ${db-moove-username} TO ${db-moove-username};

