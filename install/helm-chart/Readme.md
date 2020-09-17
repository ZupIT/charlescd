### Installation with helm charts
This installation is recommended for who has already setup your infrastructure due to a more complex environment or have some security or/and scalability limitations, which demands a more complete installation customization from CharlesCD.


| field                                        | description                                                                 | default                                           |
|----------------------------------------------|-----------------------------------------------------------------------------|---------------------------------------------------|
| butler.enabled                               | enable butler installation                                                  | true                                              |
| butler.name                                  | name of deployment                                                          | charlescd-butler                                  |
| butler.database.name                         | database name                                                               | charlescd_butler                                  |
| butler.database.host                         | host of database                                                            | charlescd-postgresql                              |
| butler.database.port                         | port of database                                                            | 5432                                              |
| butler.database.user                         | user of database                                                            | charlescd_butler                                  |
| butler.database.password                     | password of database                                                        | 3f2Yq8R4HhDCnefR                                  |
| butler.replicaCount                          | number of pods                                                              | 1                                                 |
| butler.image.name                            | image on dockerhub                                                          | zupcharles/charlescd-butler:0.2.1                 |
| butler.image.pullPolicy                      | [documentation](https://kubernetes.io/docs/concepts/containers/images/)     | Always                                            |
| butler.service.name                          | name of service in k8s                                                      | charlescd-butler                                  |
| butler.service.type                          | type of service                                                             | ClusterIp                                         |
| butler.resources.limits.cpu                  | max amount of CPU that a container can use                                  | 128m                                              |
| butler.resources.limits.memory               | max amount of memory that a container can use                               | 256Mi                                             |
| butler.resources.requests.cpu                | min amount of CPU that a container needs to function                        | 128m                                              |
| butler.resources.requests.memory             | min amount of memory that a container needs to function                     | 128Mi                                             |
| moove.enabled                                | enable moove installation                                                   | true                                              |
| moove.name                                   | name of deployment                                                          | charlescd-moove                                   |
| moove.allowedOriginHost                      | host of frontend (cors use)                                                 | http://charlescd.example.com                      |
| moove.database.name                          | database name                                                               | charlescd_moove                                   |
| moove.database.host                          | host of database                                                            | charlescd-postgresql                              |
| moove.database.port                          | port of database                                                            | 5432                                              |
| moove.database.user                          | user of database                                                            | charlescd_moove                                   |
| moove.database.password                      | password of database                                                        | 7Qs2KuM9gYzw48BS                                  |
| moove.replicaCount                           | number of pods                                                              | 1                                                 |
| moove.image.name                             | image on dockerhub                                                          | zupcharles/charlescd-butler:0.2.1                 |
| moove.image.pullPolicy                       | [documentation](https://kubernetes.io/docs/concepts/containers/images/)     | Always                                            |
| moove.service.name                           | name of service in k8s                                                      | charlescd-moove                                   |
| moove.service.type                           | type of service                                                             | ClusterIp                                         |
| moove.resources.limits.cpu                   | max amount of CPU that a container can use                                  | 1                                                 |
| moove.resources.limits.memory                | max amount of memory that a container can use                               | 1024Mi                                            |
| moove.resources.requests.cpu                 | min amount of CPU that a container needs to function                        | 128m                                              |
| moove.resources.requests.memory              | min amount of memory that a container needs to function                     | 128Mi                                             |
| villager.enabled                             | enable villager installation                                                | true                                              |
| villager.name                                | deployment name for villager                                                | charlescd-villager                                |
| villager.database.name                       | name of villager database                                                   | charlescd_villager                                |
| villager.database.host                       | hostname of database                                                        | charlescd-postgresql                              |
| villager.database.port                       | the database port                                                           | 5432                                              |
| villager.database.user                       | username to connect to database                                             | charlescd_villager                                |
| villager.database.password                   | password to connect to database                                             | ZkQ67Lnhs2bM3MPN                                  |
| villager.replicaCount                        | number of pods to run                                                       | 1                                                 |
| villager.image.name                          | name of villager image                                                      | zupcharles/charlescd-villager:0.2.2               |
| villager.image.pullPolicy                    | [See documentation](https://kubernetes.io/docs/concepts/containers/images/) | Always                                            |
| villager.service.name                        | name of villager service                                                    | charlescd-villager                                |
| villager.service.type                        | type of villager service                                                    | ClusterIP                                         |
| villager.resources.limits.cpu                | max amount of cpu that container can use                                    | 256m                                              |
| villager.resources.limits.memory             | max memory to be used to run                                                | 512Mi                                             |
| villager.resources.requests.cpu              | minimum allocated amount of cpu that container can use                      | 128m                                              |
| villager.resources.requests.memory           | minimum allocated amount of memmory that container can use                  | 128Mi                                             |
| ui.enabled                                   | enable UI installation                                                      | true                                              |
| ui.name                                      | deployment name for UI                                                      | charlescd-ui                                      |
| ui.apiHost                                   | Api host                                                                    | http://charles-example-ui.com                     |
| ui.isIdmEnables                              | Setting if UI should authenticate with external IDM (0 = false, 1 = true)   | 0                                                 |
| ui.idmLoginUri                               | IDM Login URI                                                               | /protocol/openid-connect/auth                     |
| ui.idmLogoutUri                              | IDM Logout URI                                                              | /protocol/openid-connect/logout                   |
| ui.idmRedirectHost                           | Host that the IDM should redirect after login                               | http://charles.info.example                       |
| ui.authUri                                   | Keycloak or IDM host                                                        | http://charles-example-keycloak.com/keycloak/auth |
| ui.replicaCount                              | number of pods to run                                                       | 1                                                 |
| ui.image.name                                | name of UI image                                                            | zupcharles/charlescd-ui:0.2.2                     |
| ui.image.pullPolicy                          | [See documentation](https://kubernetes.io/docs/concepts/containers/images/) | Always                                            |
| ui.service.name                              | name of UI service                                                          | charlescd-ui                                      |
| ui.service.type                              | type of UI service                                                          | ClusterIP                                         |
| ui.resources.limits.cpu                      | max amount of cpu that container can use                                    | 127m                                              |
| ui.resources.limits.memory                   | max memory to be used to run                                                | 128Mi                                             |
| ui.resources.requests.cpu                    | minimum allocated amount of cpu that container can use                      | 64m                                               |
| ui.resources.requests.memory                 | minimum allocated amount of memmory that container can use                  | 64Mi                                              |
| circlematcher.enabled                        | enable Circle Matcher installation                                          | true                                              |
| circlematcher.name                           | deployment name for Circle Matcher                                          | charlescd-circle-matcher                          |
| circlematcher.redis.host                     | hostname of Redis instance                                                  | charlescd-redis-master                            |
| circlematcher.redis.port                     | port of Redis instance                                                      | 6379                                              |
| circlematcher.redis.password                 | password of Redis                                                           | hb2Fj9MGKjBkZ6zV                                  |
| circlematcher.allowedOriginHost              | host of frontend (cors use)                                                 | -                                                 |
| circlematcher.replicaCount                   | number of pods to run                                                       | 1                                                 |
| circlematcher.image.name                     | name of Circle Matcher image                                                | zupcharles/charlescd-circle-matcher:0.2.2         |
| circlematcher.image.pullPolicy               | [See documentation](https://kubernetes.io/docs/concepts/containers/images/) | -                                                 |
| circlematcher.service.name                   | name of Circle Matcher service                                              | charlescd-circle-matcher                          |
| circlematcher.service.type                   | type of Circle Matcher service                                              | ClusterIP                                         |
| circlematcher.resources.limits.cpu           | max amount of cpu that container can use                                    | 256m                                              |
| circlematcher.resources.limits.memory        | max memory to be used to run                                                | 256Mi                                             |
| circlematcher.resources.requests.cpu         | minimum allocated amount of cpu that container can use                      | 128m                                              |
| circlematcher.resources.requests.memory      | minimum allocated amount of memmory that container can use                  | 128Mi                                             |
| keycloak.enabled                             | enable keycloak install                                                     | true                                              |
| keycloak.keycloak                            | override keycloak chart values                                              | ---                                               |
| keycloak.keycloak.extraEnv                   | extra envs for keycloak (database and front end host)                       | ---                                               |
| keycloak.keycloak.replicas                   | number of pods                                                              | 1                                                 |
| keycloak.keycloak.persistence.deployPostgres | keycloak chart supports postgresql install                                  | false                                             |
| postgresql.enabled                           | install postgresql in cluster with all databases                            | true                                              |
| postgresql.postgresqlUsername                | root username                                                               | postgres                                          |
| postgresql.postgresqlPassword                | root password                                                               | firstpassword                                     |
| redis.enabled                                | enables the installation of redis. (use only if using the circle-matcher)   | true                                              |
| redis.password                               | password of redis                                                           | hb2Fj9MGKjBkZ6zV                                  |
| mongodb.enabled                              | enables the installation of redis. (use only if using the octopipe)         | true                                              |
| mongodb.mongodbRootPassword                  | password of root user                                                       | octopipe                                          |
| nginx.enabled                                | enable nginx ingress (documentation)                                        | true                                              |
| nginx.ui.enabled                             | enable nginx ingress to frontend                                            | true                                              |
| nginx.moove.enabled                          | enable nginx ingress to moove                                               | true                                              |
| nginx.octopipe.enabled                       | enable nginx ingress to octopipe                                            | true                                              |
| nginx.keycloak.enabled                       | enable nginx ingress to keycloak                                            | true                                              |
| octopipe.enabled                             | enables the installation of octopipe                                        | true                                              |
| octopipe.envVars                             | used to config mongo connection                                             | ---                                               |
| sidecarIstio.enabled                         | if you have istio installed and want to enable sidecar                      | true                                              |
