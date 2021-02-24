{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "test.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "test.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "test.appName" -}}
{{- if .RangeContext.fullnameOverride -}}
{{- .RangeContext.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .ChartContext.Chart.Name .RangeContext.name -}}
{{- if contains $name .ChartContext.Release.Name -}}
{{- .ChartContext.Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" $name .ChartContext.Release.Name  | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}


{{- define "test.appEnvs" -}}
{{- if contains "butler" .RangeContext.name }}
{{ include "test.butler-envs" .}}
{{- end -}}
{{- if contains "moove" .RangeContext.name }}
{{ include "test.moove-envs" .}}
{{- end -}}
{{- if contains "compass" .RangeContext.name }}
{{ include "test.compass-envs" .}}
{{- end -}}
{{- if contains "matcher" .RangeContext.name }}
{{ include "test.circle-matcher-envs" .}}
{{- end -}}
{{- if contains "villager" .RangeContext.name }}
{{ include "test.villager-envs" .}}
{{- end -}}
{{- if contains "ui" .RangeContext.name }}
{{ include "test.ui-envs" .}}
{{- end -}}
{{- if contains "octopipe" .RangeContext.name }}
{{ include "test.octopipe-envs" .}}
{{- end -}}
{{- end -}}


{{- define "test.octopipe-envs" -}}
env:
  - name: APP_PORT
    value: "8080"
  - name: KUBECONFIG
    value: "IN_CLUSTER"
  - name: TIMEOUT_RESOURCE_VERIFICATION
    value: "{{ .RangeContext.limits.timeoutResourceVerification}}"
  - name: LIMIT_REQUESTS_BY_SECOND
    value: "{{ .RangeContext.limits.requestBySecond}}"
{{- end -}}


{{- define "test.butler-envs" -}}
env:
- name: DATABASE_HOST
  value: {{ .RangeContext.database.host}}
- name: DATABASE_PORT
  value: "{{ .RangeContext.database.port}}"
- name: DATABASE_USER
  value: {{ .RangeContext.database.user}}
- name: DATABASE_PASS
  value: "{{ .RangeContext.database.password}}"
- name: DATABASE_NAME
  value: {{ .RangeContext.database.name}}
{{ if .RangeContext.database.ssl }}
- name: DATABASE_SSL
  value: "true"
{{ end }}
- name: MOOVE_URL
  value: "http://charlescd-moove:8080"
- name: DARWIN_NOTIFICATION_URL
  value: "http://charlescd-butler.{{ .ChartContext.Release.Namespace }}.svc.cluster.local:3000/notifications"
- name: DARWIN_CALLBACK
  value: "http://charlescd-butler.{{ .ChartContext.Release.Namespace }}.svc.cluster.local:3000/notifications"
- name: OCTOPIPE_URL
  value: "http://charlescd-octopipe:8080"
- name: BUTLER_URL
  value: "http://charlescd-butler.{{ .ChartContext.Release.Namespace }}.svc.cluster.local:3000"
- name: ENCRYPTION_KEY
  valueFrom:
    secretKeyRef:
      name: deploy-aes256-key
      key: encryption-key
{{- end -}}

{{- define "test.moove-envs" -}}
env:
- name: SPRING_PROFILES_ACTIVE
  value: "k8s"
- name: DB_URL
  value: "jdbc:postgresql://{{ .RangeContext.database.host}}:{{ .RangeContext.database.port }}/{{ .RangeContext.database.name}}"
- name: DB_USERNAME
  value: "{{ .RangeContext.database.user}}"
- name: DB_PASSWORD
  value: "{{ .RangeContext.database.password}}"
- name: KEYCLOCK_REALM
  value: "{{ .RangeContext.keycloak.realm }}"
{{ if .ChartContext.Values.keycloak.enabled }}
- name: KEYCLOAK_SERVER_URL
  value: "http://{{ .ChartContext.Release.Name }}-keycloak-http/keycloak/auth"
{{ else }}
- name: KEYCLOAK_SERVER_URL
  value: "{{ .RangeContext.keycloak.host}}"
{{ end }}
- name: KEYCLOAK_PUBLIC_CLIENT_ID
  value: "{{ .RangeContext.keycloak.publicClientId}}"
- name: KEYCLOAK_CLIENT_ID
  value: "{{ .RangeContext.keycloak.clientId}}"
- name: RATELIMIT_CAPACITY
  value: "4"
- name: RATELIMIT_TOKENS
  value: "4"
- name: RATELIMIT_SECONDS
  value: "1"
- name: KEYCLOAK_CLIENT_SECRET
  value: "{{ .RangeContext.keycloak.clientSecret}}"
- name: INTERNAL_IDM_ENABLED
  value: "{{ .RangeContext.internalIdmEnabled }}"
- name: ORIGIN_HOSTS
  value: "http://localhost:3000,http://localhost:3001,http://localhost:8081,http://localhost:8080,{{ .RangeContext.allowedOriginHost }}"
- name: ENCRYPTION_KEY
  valueFrom:
    secretKeyRef:
      name: "application-aes256-key"
      key: "encryption-key"
{{- end -}}

{{- define "test.circle-matcher-envs" -}}
env:
- name: SPRING_PROFILES_ACTIVE
  value: {{ .RangeContext.redis.profile }}
{{if .ChartContext.Values.redis.enabled}}
- name: SPRING_REDIS_HOST
  value: {{ .ChartContext.Release.Name }}-redis-master
{{ else }}
- name: SPRING_REDIS_HOST
  value: {{ .RangeContext.redis.host }}
{{ end}}
- name: SPRING_REDIS_PORT
  value: "{{ .RangeContext.redis.port }}"
- name: SPRING_REDIS_PASSWORD
  value: {{ .RangeContext.redis.password }}
- name: SPRING_REDIS_SSL
  value: "{{ .RangeContext.redis.ssl }}"
- name: ALLOWED_ORIGINS
  value: {{ .RangeContext.allowedOriginHost }}
{{- if .RangeContext.redis.cluster.enabled -}}
- name: SPRING_REDIS_CLUSTER_NODES
  value: {{ .RangeContext.redis.cluster.nodes}}
{{- end -}}
{{- if .RangeContext.redis.sentinel.enabled -}}
- name: SPRING_REDIS_SENTINEL_NODES
  value: {{ .RangeContext.redis.sentinel.nodes}}
- name: SPRING_REDIS_SENTINEL_MASTER
  value: {{ .RangeContext.redis.sentinel.master}}
{{- end -}}
{{- end -}}

{{- define "test.compass-envs" -}}
env:
  - name: DB_HOST
    value: "{{ .RangeContext.database.host}}"
  - name: DB_PORT
    value: "{{ .RangeContext.database.port}}"
  - name: DB_USER
    value: "{{ .RangeContext.database.user}}"
  - name: DB_PASSWORD
    value: "{{ .RangeContext.database.password}}"
  - name: DB_NAME
    value: "{{ .RangeContext.database.name}}"
  - name: MOOVE_DB_HOST
    value: "{{ .RangeContext.moove.database.host}}"
  - name: MOOVE_DB_NAME
    value: "{{ .RangeContext.moove.database.name}}"
  - name: MOOVE_DB_PORT
    value: "{{ .RangeContext.moove.database.port }}"
  - name: MOOVE_DB_USER
    value: "{{ .RangeContext.moove.database.user}}"
  - name: MOOVE_DB_PASSWORD
    value: "{{ .RangeContext.moove.database.password}}"
  - name: DB_SSL
    value: "disable"
  - name: PLUGINS_DIR
    value: {{ .RangeContext.pluginsDir }}
  - name: ENV
    value: "PROD"
  - name: DISPATCHER_INTERVAL
    value: "15s"
  - name: MOOVE_USER
    value: "{{ .RangeContext.moove.user }}"
  - name: MOOVE_PATH
    value: "http://charlescd--moove:8080"
  - name: MOOVE_AUTH
    value: "{{ .RangeContext.moove.auth }}"
  - name: REQUESTS_PER_SECOND_LIMIT
    value: "{{ .RangeContext.limits.requestsPerSecond }}"
  - name: LIMITER_TOKEN_TTL
    value: "{{ .RangeContext.limits.tokenTTL }}"
  - name: LIMITER_HEADERS_TTL
    value: "{{ .RangeContext.limits.headersTTL }}"
  - name: ENCRYPTION_KEY
    valueFrom:
      secretKeyRef:
        name: "compass-aes256-key"
        key: "encryption-key"
{{- end -}}

{{- define "test.villager-envs" -}}
env:
  - name: SPRING_PROFILES_ACTIVE
    value: "k8s"
  - name: CHARLES_VILLAGER_DB_URI
    value: "jdbc:postgresql://{{ .RangeContext.database.host}}:{{ .RangeContext.database.port }}/{{ .RangeContext.database.name}}"
  - name: CHARLES_VILLAGER_DB_USERNAME
    value: "{{ .RangeContext.database.user}}"
  - name: CHARLES_VILLAGER_DB_PASSWORD
    value: "{{ .RangeContext.database.password}}"
  - name: CHARLES_BUILD_TIMEOUT
    value: "{{ .RangeContext.buildTimeout }}"
  - name: CHARLES_villager_ORGANIZATION
    value: zup
  - name: CRYPT_KEY
    value: pvMPbPPNNB
{{- end -}}

{{- define "test.ui-envs" -}}
env:
  - name: REACT_APP_API_URI
    value: {{ .RangeContext.apiHost }}
  - name: REACT_APP_AUTH_URI
    value: {{ .RangeContext.authUri }}
  - name: REACT_APP_AUTH_REALM
    value: {{ .RangeContext.authRealm }}
  - name: REACT_APP_AUTH_CLIENT_ID
    value: {{ .RangeContext.authClient }}
  - name: REACT_APP_IDM
    value: "{{ .RangeContext.isIdmEnabled }}"
  - name: REACT_APP_IDM_LOGIN_URI
    value: {{ .RangeContext.idmLoginUri }}
  - name: REACT_APP_IDM_LOGOUT_URI
    value: {{ .RangeContext.idmLogoutUri }}
  - name: REACT_APP_IDM_REDIRECT_URI
    value: {{ .RangeContext.idmRedirectHost }}
{{- end -}}




{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "test.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "test.labels" -}}
helm.sh/chart: {{ include "test.chart" . }}
{{ include "test.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "test.selectorLabels" -}}
app.kubernetes.io/name: {{ include "test.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "test.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "test.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
