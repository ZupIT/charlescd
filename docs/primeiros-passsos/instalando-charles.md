# Installing Charles

Antes de iniciar a instalação do Charles, certifique-se de que você já configurou as seguintes [**dependências**](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/usando-o-charles/configuracao-de-dependencias):

* Vault
* Spinnaker \(versão 1.17.3\)
* Keycloak
* Tyk
* Kubernetes
* Istio \(1.3\)

Feito isso, o próximo passo é criar dois recursos na sua infraestrutura. São eles:

1. Quatro banco de dados PostgreSQL
2. Um Redis

Depois de garantir todos os recursos necessários, você deverá pegar o arquivo job.yaml na raiz do repositório do produto \(ou copiar o conteúdo abaixo\) e editar os campos de variável de ambiente com os valores necessários:

```yaml
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: darwin-install
spec:
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: "false"
    spec:
      containers:
      - name: darwin-install
        image: realwavelab.azurecr.io/darwin-builder:v1
        imagePullPolicy: Always
        command: ["./main"]
        env:
          - name: NAMESPACE
            value: "namespace"
          - name: VAULT_URI
            value: "http://HOSTVAULT:8200"
          - name: APPLICATION_CONSUL
            value: "http://HOSTCONSUL:8500"
          - name: DEPLOY_DATABASE_HOST
            value: "HOSTPOSTGRESQLDEPLOY"
          - name: DEPLOY_DATABASE_PASS
            value: "PASSWORDPOSTGRESQLDEPLOY"
          - name: DEPLOY_DATABASE_USER
            value: "USERDPOSTGRESQLDEPLOY"
          - name: DEPLOY_DATABASE_NAME
            value: "DBNAMEPOSTGRESQLDEPLOY"
          - name: DEPLOY_DATABASE_PORT
            value: "PORTPOSTGRESQLDEPLOY",
          - name: DEPLOY_MOOVE_URL
            value: "http://darwin-application:8080"
          - name: DEPLOY_NOTIFICATION_CALLBACK
            value: "http://darwin-deploy.darwin.svc.cluster.local:3000/notifications"
          - name: DEPLOY_UNDEPLOYMENT_CALLBACK
            value: "http://darwin-deploy.darwin.svc.cluster.local:3000/notifications/undeployment"
          - name: DEPLOY_DEPLOYMENT_CALLBACK
            value: "http://darwin-deploy.darwin.svc.cluster.local:3000/notifications/deployment"
          - name: DEPLOY_SPINNAKER_URL
            value: "SPINNAKER-GATE-URL"
          - name: DEPLOY_SPINNAKER_GITHUB_ACCOUNT
            value: "ACCOUNT-GITHUB-SPINNAKER"
          - name: VILLAGER_DB_HOST
            value: "jdbc:postgresql://HOSTVILLAGER+PORTVILLAGER+DBNAMEVILLAGER"
          - name: VILLAGER_DB_USERNAME
            value: "USERNAMEVILLAGER"
          - name: VILLAGER_DB_PASSWORD
            value: "PASSVILLAGER"
          - name: NOTIFICATIONS_DB_URL
            value: "jdbc:postgresql://HOSTNOTIFICATIONS+PORTNOTIFICATIONS+DBNAMENOTIFICATIONS"
          - name: NOTIFICATIONS_DB_USERNAME
            value: "USERNAMENOTIFICATIONS"
          - name: NOTIFICATIONS_DB_PASSWORD
            value: "PASSWORDNOTIFICATIONS"
          - name: CIRCLE_MATCHER_NODES
            value: "REDISHOST+REDISPORT"
          - name: CIRCLE_MATCHER_REDIS_PASSWORD
            value: "REDISPASSWORD"
      restartPolicy: Never
      serviceAccountName: SERVICEACCOUNT OR DEFAULT
      imagePullSecrets:
        - name: realwavelab-registry
  backoffLimit: 2
```

```text
Depois de preencher as variáveis você deverá aplicar esse JOB no seu cluster com o seguinte comando.

```text
```

kubectl apply -f PATH/job.yaml --namespace=NAMESPACE

```text

```

Você verá que, após o JOB, seis novos deployments e services foram criados:

1. **`Darwin-application`**
2. **`Darwin-circle-matcher`**
3. **`Darwin-deploy`**
4. **`Darwin-notifications`**
5. **`Darwin-ui`**
6. **`Darwin-villager`**

## **Casos Especiais**

Caso seu cluster use alguma RBAC você precisará usar uma ServiceAccount com poderes de admin para que o job possa criar os deployments e services.

Para fazer isso basta aplicar:

```text
kubectl create clusterrolebinding default-admin --clusterrole=admin --serviceaccount=NAMESPACE:SERVICEACCOUNT
```



```text

```

Feito isso, na sequência use a `SERVICEACCOUNT` no arquivo job.yaml

