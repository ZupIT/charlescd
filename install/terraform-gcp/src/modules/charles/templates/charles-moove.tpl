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
    value: "32e76153-d62e-403b-9105-d5a36946d807"
  - name: ZUP_CORS_ALLOWED-ORIGINS
    value: "http://localhost:3000,http://localhost:3001,http://localhost:8081,http://localhost:8080,https://darwin.continuousplatform.com, http://35.222.121.238:3000"