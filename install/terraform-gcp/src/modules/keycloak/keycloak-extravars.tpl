keycloak:
    password: ${keycloak_password}
    persistence:
        dbPassword: ${keycloak_password}
    podAnnotations:
        sidecar.istio.io/rewriteAppHTTPProbers: "\"true\""


    extraEnv: |
        - name: KEYCLOAK_FRONTEND_URL
          value: "https://charles-keycloak.continuousplatform.com/auth"
        - name: PROXY_ADDRESS_FORWARDING
          value: "true"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "firstpassword"
        - name: DB_VENDOR
          value: "POSTGRES"
        - name: DB_PORT
          value: "5432"
        - name: DB_ADDR
          value: "charles-postgresql"
        - name: DB_DATABASE
          value: "keycloak"
        - name: DB_SCHEMA
          value: "public"