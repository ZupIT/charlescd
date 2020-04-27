envVars:
  - name: SPRING_PROFILES_ACTIVE
    value: "k8s"
  - name: DB_URL
    value: jdbc:postgresql://charles-postgresql:5432/${db-notifications-user}
  - name: DB_USERNAME
    value: ${db-notifications-user}
  - name: DB_PASSWORD
    value: ${db-notifications-pass}