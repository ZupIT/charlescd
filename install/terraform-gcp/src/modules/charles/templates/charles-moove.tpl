envVars:
  - name: SPRING_PROFILES_ACTIVE
    value: "k8s"
  - name: DB_URL
    value: "jdbc:postgresql://charles-postgresql:5432/${db-moove-username}?sslMode=disabled"
  - name: DB_USERNAME
    value: "postgres"
  - name: DB_PASSWORD
    value: "firstpassword"
  - name: KEYCLOCK_REALM
    value: "darwin"
  - name: KEYCLOAK_SERVER_URL
    value: "http://charles-keycloak-http/auth"
  - name: KEYCLOAK_CLIENT_ID
    value: "realm-darwin"
  - name: KEYCLOAK_CLIENT_SECRET
    value: "d0ea8e11-00a5-4723-9594-755a8025d4e1"
  - name: ORIGIN_HOSTS
    value: "http://localhost:3000,http://localhost:3001,http://localhost:8081,http://localhost:8080,https://charles.continuousplatform.com"