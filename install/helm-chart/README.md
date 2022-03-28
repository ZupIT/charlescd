# **charlescd**

![Version: 0.7.0](https://img.shields.io/badge/Version-0.7.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.0.0](https://img.shields.io/badge/AppVersion-1.0.0-informational?style=flat-square)

A Helm chart to install CharlesCD in Kubernetes.

## **Requirements**

| Repository | Name | Version |
|------------|------|---------|
|  | envoy | 0.3.10 |
|  | metacontroller | 1.5.6 |
| https://charts.bitnami.com/bitnami | postgresql | 10.4.1 |
| https://charts.bitnami.com/bitnami | rabbitmq | 8.12.2 |
| https://charts.bitnami.com/bitnami | redis | 14.1.0 |
| https://codecentric.github.io/helm-charts | keycloak | 10.3.1 |
| https://kubernetes.github.io/ingress-nginx | ingress-nginx | 3.15.2 |

## **Values**

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| CharlesApplications.butler.affinity | object | `{}` | Affinity rules |
| CharlesApplications.butler.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| CharlesApplications.butler.database.<<.port | int | `5432` | Default PostgreSQL Port |
| CharlesApplications.butler.database.name | string | `"charlescd_butler"` | Database name |
| CharlesApplications.butler.database.password | string | `"3f2Yq8R4HhDCnefR"` | Database password |
| CharlesApplications.butler.database.ssl | bool | `false` | Boolean for database use SSL |
| CharlesApplications.butler.database.user | string | `"charlescd_butler"` | Database user |
| CharlesApplications.butler.enabled | bool | `true` | Enable Buttler Installation |
| CharlesApplications.butler.healthCheck.initialDelay | int | `60` | Health Check Initial Delay |
| CharlesApplications.butler.healthCheck.path | string | `"/healthcheck"` | Health Check Path |
| CharlesApplications.butler.healthCheck.port | int | `3000` | Health Check Port |
| CharlesApplications.butler.image.application | string | `"charlescd-butler"` | Repository Image Name |
| CharlesApplications.butler.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.butler.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.butler.name | string | `"charlescd-butler"` | Name of Deployment |
| CharlesApplications.butler.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.butler.postgresqlWait | bool | `true` | Boolean, init container that waits for database be ready |
| CharlesApplications.butler.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.butler.replicaCount | int | `1` | Replica Count |
| CharlesApplications.butler.requestSizeLimit | string | `"50mb"` | Max size payload for Butler |
| CharlesApplications.butler.resources.limits.cpu | string | `"128m"` | Resource CPU Limit |
| CharlesApplications.butler.resources.limits.memory | string | `"256Mi"` | Resource Memory Limit |
| CharlesApplications.butler.resources.requests.cpu | string | `"128m"` | Resource CPU Requests |
| CharlesApplications.butler.resources.requests.memory | string | `"128Mi"` | Resource Memory Requests |
| CharlesApplications.butler.service.name | string | `"charlescd-butler"` | Service Name |
| CharlesApplications.butler.service.ports[0] | object | `{"name":"http","port":3000}` | Port Protocol |
| CharlesApplications.butler.service.ports[0].port | int | `3000` | Port Number |
| CharlesApplications.butler.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.butler.serviceAccountName | string | `"charlescd-butler"` | Service Account for Butler |
| CharlesApplications.butler.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.butler.tlsSkipVerify | bool | `false` | Boolean for skip verify git endpoint certificate, useful for self-signed certificates on gitlab. |
| CharlesApplications.butler.tolerations | list | `[]` | Tolerations rules |
| CharlesApplications.circleMatcher.affinity | object | `{}` | Affinity rules |
| CharlesApplications.circleMatcher.allowedOriginHost | string | `"http://charles.info.example"` | CORS configuration |
| CharlesApplications.circleMatcher.autoscaling.maxReplicas | int | `10` | Max replicas |
| CharlesApplications.circleMatcher.autoscaling.minReplicas | int | `1` | Min replicas |
| CharlesApplications.circleMatcher.autoscaling.targetMemoryUtilizationPercentage | int | `80` | Memory trigger to scale the service |
| CharlesApplications.circleMatcher.enabled | bool | `true` | Enable Circle-Matcher Installation |
| CharlesApplications.circleMatcher.healthCheck.initialDelay | int | `120` | Health Check Initial Delay |
| CharlesApplications.circleMatcher.healthCheck.path | string | `"/actuator/health"` | Health Check Path |
| CharlesApplications.circleMatcher.healthCheck.port | int | `8080` | Health Check Port |
| CharlesApplications.circleMatcher.hpa | bool | `true` | Enable HPA |
| CharlesApplications.circleMatcher.image.application | string | `"charlescd-circle-matcher"` | Repository Image Name |
| CharlesApplications.circleMatcher.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.circleMatcher.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.circleMatcher.name | string | `"charlescd-circle-matcher"` | Name of Deployment |
| CharlesApplications.circleMatcher.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.circleMatcher.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.circleMatcher.redis.cluster.enabled | bool | `false` | Enable Cluster |
| CharlesApplications.circleMatcher.redis.cluster.nodes | string | `"example"` | Nodes of the Cluster |
| CharlesApplications.circleMatcher.redis.host | string | `"charlescd-redis-master"` | Redis Host |
| CharlesApplications.circleMatcher.redis.password | string | `"hb2Fj9MGKjBkZ6zV"` | Redis Password |
| CharlesApplications.circleMatcher.redis.port | int | `6379` | Redis Port |
| CharlesApplications.circleMatcher.redis.profile | string | `"redis-standalone"` | Available Profiles: redis-standalone, redis-cluster and redis-sentinel |
| CharlesApplications.circleMatcher.redis.sentinel.enabled | bool | `false` | Enable Sentinel |
| CharlesApplications.circleMatcher.redis.sentinel.master | string | `"example"` | Master Node |
| CharlesApplications.circleMatcher.redis.sentinel.nodes | string | `"example"` | Nodes of Sentinel |
| CharlesApplications.circleMatcher.redis.ssl | bool | `false` | Enable SSL |
| CharlesApplications.circleMatcher.replicaCount | int | `1` | Replica Count |
| CharlesApplications.circleMatcher.resources.limits.cpu | string | `"500m"` | Resource CPU Limit |
| CharlesApplications.circleMatcher.resources.limits.memory | string | `"384Mi"` | Resource Memory Limit |
| CharlesApplications.circleMatcher.resources.requests.cpu | string | `"500m"` | Resource CPU Requests |
| CharlesApplications.circleMatcher.resources.requests.memory | string | `"384Mi"` | Resource Memory Requests |
| CharlesApplications.circleMatcher.service.name | string | `"charlescd-circle-matcher"` | Service Name |
| CharlesApplications.circleMatcher.service.ports[0] | object | `{"name":"http","port":8080}` | Port Protocol |
| CharlesApplications.circleMatcher.service.ports[0].port | int | `8080` | Port Number |
| CharlesApplications.circleMatcher.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.circleMatcher.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.circleMatcher.tolerations | list | `[]` | Tolerations rules |
| CharlesApplications.compass.affinity | object | `{}` | Affinity rules |
| CharlesApplications.compass.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| CharlesApplications.compass.database.<<.port | int | `5432` | Default PostgreSQL Port |
| CharlesApplications.compass.database.name | string | `"charlescd_compass"` | Database name |
| CharlesApplications.compass.database.password | string | `"C1UinUu6N0vc"` | Database password |
| CharlesApplications.compass.database.user | string | `"charlescd_compass"` | Database user |
| CharlesApplications.compass.databaseIgnoreSSL | string | `"disable"` | Database ignore SSL |
| CharlesApplications.compass.dispatchInterval | string | `"15s"` | Dispatch Interval in seconds |
| CharlesApplications.compass.enabled | bool | `true` | Enable Compass Installation |
| CharlesApplications.compass.healthCheck.initialDelay | int | `60` | Health Check Initial Delay |
| CharlesApplications.compass.healthCheck.path | string | `"/health"` | Health Check Path |
| CharlesApplications.compass.healthCheck.port | int | `8080` | Health Check Port |
| CharlesApplications.compass.image.application | string | `"charlescd-compass"` | Repository Image Name |
| CharlesApplications.compass.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.compass.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.compass.limits.headersTTL | string | `"5"` | Headers TTL |
| CharlesApplications.compass.limits.requestsPerSecond | string | `"5"` | Requests per Second |
| CharlesApplications.compass.limits.tokenTTL | string | `"5"` | Token TTL |
| CharlesApplications.compass.moove.auth | string | <code>"Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOi<br />AiSldUIiwia2lkIiA6ICJrcXkydE1XY2E1VVha<br />YjdONXZNSEE0b25NRkZqNkVLandSV0tnaTJvQk<br />hNIn0.eyJleHAiOjE2MTEyNTMzMzcsImlhdCI6<br />MTYxMTI0OTczNywianRpIjoiNmU5OWYyZjUtOT<br />BlMS00OGFjLWFlN2QtYWJkMjIyODIwY2FmIiwi<br />aXNzIjoiaHR0cDovL2NoYXJsZXMuaW5mby5leG<br />FtcGxlL2tleWNsb2FrL2F1dGgvcmVhbG1zL2No<br />YXJsZXNjZCIsImF1ZCI6ImRhcndpbi1jbGllbn<br />QiLCJzdWIiOiJkYThjYTQ5OC1lNDQ5LTQzMjYt<br />YThkZC00ODM5NDI0Y2JkZDAiLCJ0eXAiOiJCZW<br />FyZXIiLCJhenAiOiJjaGFybGVzY2QtY2xpZW50<br />Iiwic2Vzc2lvbl9zdGF0ZSI6IjI5Mzk2ZDZlLW<br />I4ZDctNGU0ZC1hYTI2LWVlYWVlM2M5ODRjNSIs<br />ImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOl<br />siKiJdLCJzY29wZSI6InByb2ZpbGUgZW1haWwi<br />LCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNSb2<br />90Ijp0cnVlLCJuYW1lIjoiY2hhcmxlc2FkbWlu<br />QGFkbWluIGNoYXJsZXNhZG1pbkBhZG1pbiIsIn<br />ByZWZlcnJlZF91c2VybmFtZSI6ImNoYXJsZXNh<br />ZG1pbkBhZG1pbiIsImdpdmVuX25hbWUiOiJjaG<br />FybGVzYWRtaW5AYWRtaW4iLCJmYW1pbHlfbmFt<br />ZSI6ImNoYXJsZXNhZG1pbkBhZG1pbiIsImVtYW<br />lsIjoiY2hhcmxlc2FkbWluQGFkbWluIn0.NLzu<br />9222nMb-eyIiKwbznPzSTXe26QQp5cYGWw4Mhf<br />TW43gl6bXFAd-YMSXMEz5mmRy73NlW8WWnMKfQ<br />pC2FR-3wSKajVTB5_Y2CJC8PTLjXUpcZS2UxvB<br />uV_ANZiINNovGiX87XFNhm9bHZxXzYUhDKqGh2<br />C72G18fZKUTGMCfcTFHhFjxWDx1MEm5AN5JzPN<br />btcYWmrCMufgTsaQD9pQrHWxr9-8kNgKYff6wM<br />VJLR6YIVpNVy7eHWTTOKwa59BFpw-w45clA3dt<br />cs5cbMQo6GoA52_f5XdyvCZ-llYfvYpT09iPMs<br />ekWjG0TTbo2hCA59VKnMZA0r7JtPan9wrQ"</code> | Moove Bearer Token |
| CharlesApplications.compass.moove.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| CharlesApplications.compass.moove.database.<<.port | int | `5432` | Default PostgreSQL Port |
| CharlesApplications.compass.moove.database.name | string | `"charlescd_moove"` | Database name |
| CharlesApplications.compass.moove.database.password | string | `"7Qs2KuM9gYzw48BS"` | Database password |
| CharlesApplications.compass.moove.database.user | string | `"charlescd_moove"` | Database user |
| CharlesApplications.compass.moove.user | string | `"Y2hhcmxlc2FkbWluQGFkbWlu"` | Moove User |
| CharlesApplications.compass.name | string | `"charlescd-compass"` | Name of Deployment |
| CharlesApplications.compass.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.compass.pluginsDir | string | `"./plugins"` | Compass Plugin Directory |
| CharlesApplications.compass.postgresqlWait | bool | `true` | Boolean, init container that waits for database be ready |
| CharlesApplications.compass.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.compass.replicaCount | int | `1` | Replica Count |
| CharlesApplications.compass.resources.limits.cpu | string | `"128m"` | Resource CPU Limit |
| CharlesApplications.compass.resources.limits.memory | string | `"128Mi"` | Resource Memory Limit |
| CharlesApplications.compass.resources.requests.cpu | string | `"64m"` | Resource CPU Requests |
| CharlesApplications.compass.resources.requests.memory | string | `"64Mi"` | Resource Memory Requests |
| CharlesApplications.compass.service.name | string | `"charlescd-compass"` | Service Name |
| CharlesApplications.compass.service.ports[0] | object | `{"name":"http","port":8080}` | Port Protocol |
| CharlesApplications.compass.service.ports[0].port | int | `8080` | Port Number |
| CharlesApplications.compass.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.compass.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.compass.tolerations | list | `[]` | Tolerations rules |
| CharlesApplications.gate.affinity | object | `{}` | Affinity rules |
| CharlesApplications.gate.authConfPath | string | `"./resources/auth.conf"` | Gate Auth Config Path |
| CharlesApplications.gate.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| CharlesApplications.gate.database.<<.port | int | `5432` | Default PostgreSQL Port |
| CharlesApplications.gate.database.name | string | `"charlescd_moove"` | Database name |
| CharlesApplications.gate.database.password | string | `"7Qs2KuM9gYzw48BS"` | Database password |
| CharlesApplications.gate.database.user | string | `"charlescd_moove"` | Database user |
| CharlesApplications.gate.enabled | bool | `true` | Enable Gate Installation |
| CharlesApplications.gate.healthCheck.initialDelay | int | `60` | Health Check Initial Delay |
| CharlesApplications.gate.healthCheck.path | string | `"/health"` | Health Check Path |
| CharlesApplications.gate.healthCheck.port | int | `8080` | Health Check Port |
| CharlesApplications.gate.image.application | string | `"charlescd-gate"` | Repository Image Name |
| CharlesApplications.gate.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.gate.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.gate.name | string | `"charlescd-gate"` | Name of Deployment |
| CharlesApplications.gate.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.gate.policyPath | string | `"./resources/policy.csv"` | Gate Policy Path |
| CharlesApplications.gate.postgresqlWait | bool | `true` | Boolean, init container that waits for database be ready |
| CharlesApplications.gate.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.gate.queiresPath | string | `"./internal/repository/queries/"` | Gate Queires Path |
| CharlesApplications.gate.replicaCount | int | `1` | Replica Count |
| CharlesApplications.gate.resources | object | `{}` | Resources |
| CharlesApplications.gate.service.name | string | `"charlescd-gate"` | Service Name |
| CharlesApplications.gate.service.ports[0] | object | `{"name":"http","port":8080}` | Port Protocol |
| CharlesApplications.gate.service.ports[0].port | int | `8080` | Port Number |
| CharlesApplications.gate.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.gate.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.gate.tolerations | list | `[]` | Tolerations rules |
| CharlesApplications.hermes.affinity | object | `{}` | Affinity rules |
| CharlesApplications.hermes.amqp.message.exchange | string | `"exchange-message"` | Exchange Message |
| CharlesApplications.hermes.amqp.message.queue | string | `"queue-message"` | Queue Message |
| CharlesApplications.hermes.amqp.message.routingKey | string | `"routing-key-message"` | Routing Key |
| CharlesApplications.hermes.amqp.url | string | `"amqp://guest:guest@charlescd-rabbitmq:5672/"` | AMQP URL |
| CharlesApplications.hermes.amqp.waitMessage.exchange | string | `"exchange-message-wait"` | Exchange Message Wait |
| CharlesApplications.hermes.amqp.waitMessage.queue | string | `"queue-message-wait"` | Queue Message Wait |
| CharlesApplications.hermes.consumer.messageRetry.attempts | int | `3` | Consumer Message Retry Attempts |
| CharlesApplications.hermes.consumer.messageRetry.expiration | int | `60000` | Consumer Message Retry Expiration |
| CharlesApplications.hermes.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| CharlesApplications.hermes.database.<<.port | int | `5432` | Default PostgreSQL Port |
| CharlesApplications.hermes.database.name | string | `"charlescd_hermes"` | Database name |
| CharlesApplications.hermes.database.password | string | `"aGVybWVz"` | Database password |
| CharlesApplications.hermes.database.user | string | `"charlescd_hermes"` | Database user |
| CharlesApplications.hermes.enabled | bool | `true` | Enable Hermes Installation |
| CharlesApplications.hermes.healthCheck.initialDelay | int | `60` | Health Check Initial Delay |
| CharlesApplications.hermes.healthCheck.path | string | `"/health"` | Health Check Path |
| CharlesApplications.hermes.healthCheck.port | int | `8080` | Health Check Port |
| CharlesApplications.hermes.image.application | string | `"charlescd-hermes"` | Repository Image Name |
| CharlesApplications.hermes.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.hermes.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.hermes.name | string | `"charlescd-hermes"` | Name of Deployment |
| CharlesApplications.hermes.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.hermes.postgresqlWait | bool | `true` | Boolean, init container that waits for database be ready |
| CharlesApplications.hermes.publisher.attempts | int | `3` | Number of Attempts |
| CharlesApplications.hermes.publisher.time | string | `"@every 5s"` | Publisher Cron Time |
| CharlesApplications.hermes.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.hermes.replicaCount | int | `1` | Replica Count |
| CharlesApplications.hermes.resources | object | `{}` | Pod Resources |
| CharlesApplications.hermes.service.name | string | `"charlescd-hermes"` | Service Name |
| CharlesApplications.hermes.service.ports[0] | object | `{"name":"http","port":8080}` | Port Protocol |
| CharlesApplications.hermes.service.ports[0].port | int | `8080` | Port Number |
| CharlesApplications.hermes.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.hermes.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.hermes.subscriptionRegisterLimit | int | `5` | Subscription Register Limit |
| CharlesApplications.hermes.tolerations | list | `[]` | Tolerations rules |
| CharlesApplications.moove.affinity | object | `{}` | Affinity rules |
| CharlesApplications.moove.allowedOriginHost | string | `"http://charles.info.example"` | CORS Configuration |
| CharlesApplications.moove.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| CharlesApplications.moove.database.<<.port | int | `5432` | Default PostgreSQL Port |
| CharlesApplications.moove.database.name | string | `"charlescd_moove"` | Database name |
| CharlesApplications.moove.database.password | string | `"7Qs2KuM9gYzw48BS"` | Database password |
| CharlesApplications.moove.database.user | string | `"charlescd_moove"` | Database user |
| CharlesApplications.moove.enabled | bool | `true` | Enable Moove Installation |
| CharlesApplications.moove.gitlabIgnoreSSL | bool | `true` | Boolean for skip verify git endpoint certificate, useful for self-signed certificates on gitlab. |
| CharlesApplications.moove.healthCheck.initialDelay | int | `180` | Health Check Initial Delay |
| CharlesApplications.moove.healthCheck.path | string | `"/actuator/health"` | Health Check Path |
| CharlesApplications.moove.healthCheck.port | int | `8080` | Health Check Port |
| CharlesApplications.moove.image.application | string | `"charlescd-moove"` | Repository Image Name |
| CharlesApplications.moove.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.moove.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.moove.internalIdmEnabled | bool | `true` | Enable IDM |
| CharlesApplications.moove.keycloak.clientId | string | `"realm-charlescd"` | Keycloak Client ID |
| CharlesApplications.moove.keycloak.clientSecret | string | `"441cfd37-8443-4f3d-bf6c-ee9861b04e28"` | Keycloak Client Secret |
| CharlesApplications.moove.keycloak.host | string | `"http://examplename-keycloak-http/keycloak/auth"` | Keycloak Host URL - Used for IDM |
| CharlesApplications.moove.keycloak.publicClientId | string | `"charlescd-client"` | Keycloak Public Client ID |
| CharlesApplications.moove.keycloak.realm | string | `"charlescd"` | Keycloak Realm |
| CharlesApplications.moove.name | string | `"charlescd-moove"` | Name of Deployment |
| CharlesApplications.moove.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.moove.postgresqlWait | bool | `true` | Boolean, init container that waits for database be ready |
| CharlesApplications.moove.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.moove.replicaCount | int | `1` | Replica Count |
| CharlesApplications.moove.resources.limits.cpu | int | `1` | Resource CPU Limit |
| CharlesApplications.moove.resources.limits.memory | string | `"1024Mi"` | Resource Memory Limit |
| CharlesApplications.moove.resources.requests.cpu | string | `"128m"` | Resource CPU Requests |
| CharlesApplications.moove.resources.requests.memory | string | `"128Mi"` | Resource Memory Requests |
| CharlesApplications.moove.service.name | string | `"charlescd-moove"` | Service Name |
| CharlesApplications.moove.service.ports[0] | object | `{"name":"http","port":8080}` | Port Protocol |
| CharlesApplications.moove.service.ports[0].port | int | `8080` | Port Number |
| CharlesApplications.moove.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.moove.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.moove.tolerations | list | `[]` | Tolerations rules |
| CharlesApplications.ui.affinity | object | `{}` | Affinity rules |
| CharlesApplications.ui.apiHost | string | `"http://charles.info.example"` | CharlesCD API Host |
| CharlesApplications.ui.authClient | string | `"charlescd-client"` | CharlesCD Keycloak Auth Client |
| CharlesApplications.ui.authRealm | string | `"charlescd"` | CharlesCD Keycloak Realm |
| CharlesApplications.ui.authUri | string | `"http://charles.info.example/keycloak"` | CharlesCD Auth URI |
| CharlesApplications.ui.database | object | `{}` |  |
| CharlesApplications.ui.enabled | bool | `true` | Enable UI Installation |
| CharlesApplications.ui.healthCheck.initialDelay | int | `20` | Health Check Initial Delay |
| CharlesApplications.ui.healthCheck.path | string | `"/"` | Health Check Path |
| CharlesApplications.ui.healthCheck.port | int | `3000` | Health Check Port |
| CharlesApplications.ui.idmLoginUri | string | `"/protocol/openid-connect/auth"` | IDM Login URI |
| CharlesApplications.ui.idmLogoutUri | string | `"/protocol/openid-connect/logout"` | IDM Logout URI |
| CharlesApplications.ui.idmRedirectHost | string | `"http://charles.info.example"` | IDM Redirect Host |
| CharlesApplications.ui.image.application | string | `"charlescd-ui"` | Repository Image Name |
| CharlesApplications.ui.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.ui.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.ui.isIdmEnabled | string | `"0"` | CharlesCD IDM - 0 to Default Keycloak | 1 - External IDM |
| CharlesApplications.ui.name | string | `"charlescd-ui"` | Name of Deployment |
| CharlesApplications.ui.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.ui.postgresqlWait | bool | `false` | Boolean, init container that waits for database be ready - false because UI does not use database |
| CharlesApplications.ui.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.ui.replicaCount | int | `1` | Replica Count |
| CharlesApplications.ui.resources.limits.cpu | string | `"128m"` | Resource CPU Limit |
| CharlesApplications.ui.resources.limits.memory | string | `"128Mi"` | Resource Memory Limit |
| CharlesApplications.ui.resources.requests.cpu | string | `"64m"` | Resource CPU Requests |
| CharlesApplications.ui.resources.requests.memory | string | `"64Mi"` | Resource Memory Requests |
| CharlesApplications.ui.service.name | string | `"charlescd-ui"` | Service Name |
| CharlesApplications.ui.service.ports[0] | object | `{"name":"http","port":3000}` | Port Protocol |
| CharlesApplications.ui.service.ports[0].port | int | `3000` | Port Number |
| CharlesApplications.ui.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.ui.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.ui.tolerations | list | `[]` | Tolerations rules |
| CharlesApplications.villager.affinity | object | `{}` | Affinity rules |
| CharlesApplications.villager.buildTimeout | int | `15` | Timeout in seconds for build |
| CharlesApplications.villager.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| CharlesApplications.villager.database.<<.port | int | `5432` | Default PostgreSQL Port |
| CharlesApplications.villager.database.name | string | `"charlescd_villager"` | Database name |
| CharlesApplications.villager.database.password | string | `"ZkQ67Lnhs2bM3MPN"` | Database password |
| CharlesApplications.villager.database.user | string | `"charlescd_villager"` | Database user |
| CharlesApplications.villager.enabled | bool | `true` | Enable Villager Installation |
| CharlesApplications.villager.healthCheck.initialDelay | int | `60` | Health Check Initial Delay |
| CharlesApplications.villager.healthCheck.path | string | `"/health"` | Health Check Path |
| CharlesApplications.villager.healthCheck.port | int | `8080` | Health Check Port |
| CharlesApplications.villager.image.application | string | `"charlescd-villager"` | Repository Image Name |
| CharlesApplications.villager.image.registry | string | `"zupcharles"` | Repository Registry |
| CharlesApplications.villager.imagePullSecrets | bool | `false` | Check if need credentials for pulling images from repository |
| CharlesApplications.villager.name | string | `"charlescd-villager"` | Name of Deployment |
| CharlesApplications.villager.nodeSelector | object | `{}` | Node Selector, it specifies a map of key-value pairs. For the pod to be eligible to run on a node |
| CharlesApplications.villager.postgresqlWait | bool | `true` | Boolean, init container that waits for database be ready |
| CharlesApplications.villager.pullPolicy | string | `"Always"` | Image Pull Policy |
| CharlesApplications.villager.replicaCount | int | `1` | Replica Count |
| CharlesApplications.villager.resources.limits.cpu | string | `"256m"` | Resource CPU Limit |
| CharlesApplications.villager.resources.limits.memory | string | `"512Mi"` | Resource Memory Limit |
| CharlesApplications.villager.resources.requests.cpu | string | `"128m"` | Resource CPU Requests |
| CharlesApplications.villager.resources.requests.memory | string | `"128Mi"` | Resource Memory Requests |
| CharlesApplications.villager.service.name | string | `"charlescd-villager"` | Service Name |
| CharlesApplications.villager.service.ports[0] | object | `{"name":"http","port":8080}` | Port Protocol |
| CharlesApplications.villager.service.ports[0].port | int | `8080` | Port Number |
| CharlesApplications.villager.service.type | string | `"ClusterIP"` | Service Type |
| CharlesApplications.villager.sidecarIstio.enabled | bool | `true` | Enable istio in installation |
| CharlesApplications.villager.tolerations | list | `[]` | Tolerations rules |
| envoy.circlematcher.enabled | bool | `true` | Enable Circle-Matcher Installation |
| envoy.compass.enabled | bool | `true` | Enable Compass Installation |
| envoy.cors.enabled | bool | `true` | Enable CORS |
| envoy.cors.hosts | list | `[]` | List of CORS Hosts with protocol [http; https] |
| envoy.enabled | bool | `true` | Enable Envoy Installation |
| envoy.gate.enabled | bool | `true` | Enable Gate Installation |
| envoy.hermes.enabled | bool | `true` | Enable Hermes Installation |
| envoy.idm.endpoint | string | `"keycloak-http"` | IDM Endpoint |
| envoy.idm.path | string | `"/keycloak/auth/realms/charlescd/protocol/openid-connect/userinfo"` | IDM Path |
| envoy.idm.port | int | `80` | IDM Port |
| envoy.idm.protocol | string | `"http"` | IDM Protocol |
| envoy.keycloak.enabled | bool | `true` | Enable Keycloak Installation |
| envoy.moove.enabled | bool | `true` | Enable Moove Installation |
| envoy.ui.enabled | bool | `true` | Enable UI Installation |
| hostGlobal | string | `"http://charles.info.example"` | Default Hostname for CharlesCD |
| ingress-nginx.controller.ingressClass | string | `"nginx"` | Ingress Class |
| ingress-nginx.controller.service.annotations | object | `{}` | Ingress-nginx Annotations |
| ingress.class | string | `"nginx"` | Ingress Class |
| ingress.enabled | bool | `true` | Enable Ingress |
| ingress.host | string | `"charles.info.example"` | Ingress Host |
| job | object | `{"enabled":false,"name":"init-db"}` | Job that executes initDB Scripts if you choose to use your own PostgreSQL Database |
| job.enabled | bool | `false` | Enable Job Creation and Execution |
| job.name | string | `"init-db"` | Job Name |
| keycloak.auth.adminPassword | string | `"firstpassword"` | Auth Init Password |
| keycloak.charlesHost | string | `"http://charles.info.example"` | CharlesCD Host URI |
| keycloak.contextPath | string | `"keycloak/auth"` | Keycloak Context Path |
| keycloak.database.<<.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| keycloak.database.<<.port | int | `5432` | Default PostgreSQL Port |
| keycloak.database.name | string | `"keycloak"` | Database name |
| keycloak.database.password | string | `"DCWYW66Mq2ca6w8u"` | Database password |
| keycloak.database.user | string | `"keycloak"` | Database user |
| keycloak.enabled | bool | `true` | Enable Keycloak Installation |
| keycloak.extraEnv | string | <code>- name: PROXY_ADDRESS_FORWARDING<br />&nbsp;&nbsp;value: \"true\"<br />- name: DB_USER<br />&nbsp;&nbsp;value: \"{{ .Values.database.user }}\"<br />- name: DB_PASSWORD<br />&nbsp;&nbsp;value: \"{{ .Values.database.password }}\"<br />- name: DB_VENDOR<br />&nbsp;&nbsp;value: \"POSTGRES\"<br />- name: DB_PORT<br />&nbsp;&nbsp;value: \"{{ .Values.database.port }}\"<br />- name: DB_ADDR<br />&nbsp;&nbsp;value: \"{{ .Values.database.host }}\"<br />- name: DB_DATABASE<br />&nbsp;&nbsp;value: \"{{ .Values.database.name }}\"<br />- name: DB_SCHEMA<br />&nbsp;&nbsp;value: \"public\"<br />- name: JAVA_OPTS<br />&nbsp;&nbsp;value: >-<br />&nbsp;&nbsp;&nbsp;&nbsp;-Dkeycloak.migration.action=import<br />&nbsp;&nbsp;&nbsp;&nbsp;-Dkeycloak.migration.provider=singleFile<br />&nbsp;&nbsp;&nbsp;&nbsp;-Dkeycloak.migration.file=/realm/keycloak.json<br />&nbsp;&nbsp;&nbsp;&nbsp;-Dkeycloak.migration.strategy=IGNORE_EXISTING</code> | Keycloak Extra Environment Vars |
| keycloak.extraInitContainers | string | <code>- name: check-db-ready<br />&nbsp;&nbsp;&nbsp;image: postgres:9.6.5<br />&nbsp;&nbsp;command: ['sh', '-c',<br />&nbsp;&nbsp;&nbsp;&nbsp;'until pg_isready -h {{ .Values.database.host }} -p {{ .Values.database.port }};<br />&nbsp;&nbsp;&nbsp;&nbsp;do echo waiting for database; sleep 2; done;']</code>"` | Keycloak extra InitContainers |
| keycloak.extraVolumeMounts | string | <code>- name: realm-secret\n  mountPath: \"/realm/\"<br />&nbsp;&nbsp;readOnly: false</code> | Keycloak Extra Volumes Mounts |
| keycloak.extraVolumes | string | <code>- name: realm-secret<br />&nbsp;&nbsp;configMap:<br />&nbsp;&nbsp;&nbsp;&nbsp;name: keycloak-realm\n</code> | Keycloak Extra Volumes |
| keycloak.fullnameOverride | string | `"keycloak"` | Service Name |
| keycloak.livenessProbe | string | <code>httpGet:<br />&nbsp;&nbsp;path: {{ if ne .Values.contextPath \"\" }}/{{ .Values.contextPath }}{{ end }}/<br />  port: http<br />initialDelaySeconds: 300<br />timeoutSeconds: 5</code> | Keycloak Liveness Probe |
| keycloak.postgresql.enabled | bool | `false` | Enable Keycloak's Postgres |
| keycloak.readinessProbe | string | <code>httpGet:<br />&nbsp;&nbsp;path: {{ if ne .Values.contextPath \"\" }}/{{ .Values.contextPath }}{{ end }}/realms/master<br />&nbsp;&nbsp;port: http\ninitialDelaySeconds: 30<br />timeoutSeconds: 1</code> | Keycloak readiness Probe |
| keycloak.securityContext.runAsNonRoot | bool | `false` | Security Context Run as non Root, Default: false |
| keycloak.securityContext.runAsUser | int | `0` | Security Context Run as User, Default: 0 |
| keycloak.startupProbe | string | <code>httpGet:<br />&nbsp;&nbsp;path: /keycloak/auth/<br />&nbsp;&nbsp;port: http\ninitialDelaySeconds: 30<br />timeoutSeconds: 1<br />failureThreshold: 60<br />periodSeconds: 5</code> | Keycloak Startup Probe |
| keycloak.startupScripts."contextPath.cli" | string | <code>embed-server --server-config=standalone-ha.xml --std-out=echo<br />batch<br />{{- if ne .Values.contextPath \"auth\" }}<br />/subsystem=keycloak-server/:write-attribute(name=web-context,value={{ if eq .Values.contextPath \"\" }}/{{ else }}{{ .Values.contextPath }}{{ end }})<br />{{- if eq .Values.contextPath \"\" }}<br />/subsystem=undertow/server=default-server/host=default-host:write-attribute(name=default-web-module,value=keycloak-server.war)<br />{{- end }}<br />{{- end }}<br />/subsystem=keycloak-server/spi=hostname/provider=default:write-attribute(name=properties.frontendUrl, value=\"{{ .Values.charlesHost }}/{{ .Values.contextPath }}\")<br />run-batch<br />stop-embedded-server</code> | Keycloak Startup Script |
| keycloakHost | string | `"http://charles.info.example/keycloak"` | Default Hostname for Keycloak with CharlesCD (Local Authentication or IDM) |
| nginx_ingress_controller.enabled | bool | `true` | Enable NGINX Ingress Controller Installation |
| postgresql.enabled | bool | `true` | Enable PostgreSQL Installation |
| postgresql.fullnameOverride | string | `"charlescd-postgresql"` | PostgreSQL Service |
| postgresql.initdbScriptsConfigMap | string | `"charlescd-postgres"` | Name of InitDB Scripts - DO NOT CHANGE |
| postgresql.pgpassword | string | `"postgres"` | Postgres Password |
| postgresql.pguser | string | `"postgres"` | Postgres User |
| postgresql.resources.limits.cpu | string | `"128m"` | Resource CPU Limit |
| postgresql.resources.limits.memory | string | `"256Mi"` | Resource Memory Limit |
| postgresql.resources.requests.cpu | string | `"128m"` | Resource CPU Requests |
| postgresql.resources.requests.memory | string | `"128Mi"` | Resource Memory Requests |
| postgresqlGlobal.host | string | `"charlescd-postgresql"` | Default PostgreSQL Hostname |
| postgresqlGlobal.port | int | `5432` | Default PostgreSQL Port |
| rabbitmq.auth.existingErlangSecret | string | `"charlescd-rabbitmq-erl"` | RabbitMQ Erlang Secret |
| rabbitmq.auth.password | string | `"guest"` | RabbitMQ Password |
| rabbitmq.auth.username | string | `"guest"` | RabbitMQ Username |
| rabbitmq.configuration | string | <code>## Username and password<br />##<br />default_user = {{ .Values.auth.username }}<br />default_pass = {{ .Values.auth.password }}<br />## Clustering<br />##<br />cluster_formation.peer_discovery_backend  = rabbit_peer_discovery_k8s<br />cluster_formation.k8s.host = kubernetes.default.svc.{{ .Values.clusterDomain }}<br />cluster_formation.node_cleanup.interval = 10<br />cluster_formation.node_cleanup.only_log_warning = true<br />cluster_partition_handling = autoheal<br /># queue master locator<br />queue_master_locator = min-masters<br /># enable guest user<br />loopback_users.guest = false<br />{{ tpl .Values.extraConfiguration . }}<br />{{- if .Values.auth.tls.enabled }}<br />ssl_options.verify = {{ .Values.auth.tls.sslOptionsVerify }}<br />listeners.ssl.default = {{ .Values.service.tlsPort }}<br />ssl_options.fail_if_no_peer_cert = {{ .Values.auth.tls.failIfNoPeerCert }}<br />ssl_options.cacertfile = /opt/bitnami/rabbitmq/certs/ca_certificate.pem<br />ssl_options.certfile = /opt/bitnami/rabbitmq/certs/server_certificate.pem<br />ssl_options.keyfile = /opt/bitnami/rabbitmq/certs/server_key.pem<br />{{- end }}<br />{{- if .Values.metrics.enabled }}<br />## Prometheus metrics<br />##<br />prometheus.tcp.port = 9419<br />{{- end }}<br />{{- if .Values.memoryHighWatermark.enabled }}<br />## Memory Threshold<br />##<br />total_memory_available_override_value = {{ include \"rabbitmq.toBytes\" .Values.resources.limits.memory }}<br />vm_memory_high_watermark.{{ .Values.memoryHighWatermark.type }} = {{ .Values.memoryHighWatermark.value }}<br />{{- end }}</code> | RabbitMQ Configuration |
| rabbitmq.enabled | bool | `true` | Enable RabbitMQ Installation |
| rabbitmq.fullnameOverride | string | `"charlescd-rabbitmq"` | RabbitMQ Service Name |
| redis.auth.password | string | `"hb2Fj9MGKjBkZ6zV"` | Redis Auth Password |
| redis.cluster.enabled | bool | `false` | Boolean, Is cluster? |
| redis.enabled | bool | `true` | Enable Redis Installation |
| redis.fullnameOverride | string | `"charlescd-redis"` | Redis Service Name |