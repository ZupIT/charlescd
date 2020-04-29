keycloak:
  extraEnv: |
    - name: DB_USER
      value: "${postgres_user}"
    - name: DB_PASSWORD
      value: "${postgres_password}"
    - name: DB_VENDOR
      value: "POSTGRES"
    - name: DB_PORT
      value: "5432"
    - name: DB_ADDR
      value: "${postgres_database_url}"
    - name: DB_DATABASE
      value: "${postgres_database}"
    - name: DB_SCHEMA
      value: "public"
    - name: KEYCLOAK_USER
      value: "admin"
    - name: PROXY_ADDRESS_FORWARDING
      value: "true"
      
  service:
    type: NodePort

  ingress:
    enabled: true
    path: /*
    annotations:
      kubernetes.io/ingress.class: alb
      alb.ingress.kubernetes.io/scheme: internet-facing
      alb.ingress.kubernetes.io/subnets: ${subnets}
      alb.ingress.kubernetes.io/certificate-arn: ${certificate-arn-darwin-keycloak}
      external-dns.alpha.kubernetes.io/hostname:  ${address-keycloak}
    hosts:
      - ${address-keycloak}
  
  podAnnotations:
    sidecar.istio.io/inject: "\"false\""
    
  livenessProbe: |
    initialDelaySeconds: 900
    timeoutSeconds: 5
    httpGet:
      path: {{ if ne .Values.keycloak.basepath "" }}/{{ .Values.keycloak.basepath }}{{ end }}/
      port: http