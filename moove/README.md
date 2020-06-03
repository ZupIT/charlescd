# CharlesCD Moove

Moove is CharlesCD's application responsible for orchestrating the hypothesis tests of your products and the delivery pipeline until it reaches your circles, facilitating the bridge between [Butler], [Villager], and [Circle Matcher]. 
 
## How Moove Works

Through the Moove APIs, you can explore it to:
- Handle user access and permissions through user groups.
- Manage workspaces' configurations.
- Maintain your modules' configurations.
- Create circles, and define its segmentations and releases.
- Integrate with metric providers to monitor the health of your applications and explore your circle's evolution.
- Register your hypotheses and take advantage of the board managed by Moove to plan with your team the technical (or non-technical) activities for development.
- Use your hypotheses' board to automatically generate releases of all applications involved in the changes (even if they are in different branches).
 
## How to Use

### Requirements
 - [JDK 1.8+]
 - [Docker]
 - [Docker Compose]
 - [Maven]
 
Once the prerequisites were installed, if you want to run your application locally with both authentication and authorization, the following information must be filled at `application-local.properties` file:
- `charlescd.keycloak.realm`: the name of your realm.
- `charlescd.keycloak.serverUrl`: the URL of your keycloak server (for example: `https://your-keycloak.com/auth`)
- `charlescd.keycloak.clientId`: a client identity token.
- `charlescd.keycloak.clientSecret`: the client secret.

All these information belongs to your [Keycloak] server.
                                     
After that, you have two options to start the application:

### On terminal

Inside the root folder, run the following command:

```
docker-compose up
mvn clean install
./web/run-local.sh
```

### Using your IDE
Once you run the command `docker-compose up` on your terminal, set the property `spring.profiles.active` as `local` and start the application.

After both approaches, the application will be available on port 8080. Additionally, two containers will be running: a PostgreSQL database and a stub server.
 
Moove provides a [Swagger API Documentation], and also an up to date [Postman Collection].

## Documentation

Please check our [Documentation].

## Contributing

Please check our [Contributing Guide].

[JDK 1.8+]: https://www.oracle.com/java/technologies/javase-jdk8-downloads.html
[Docker]: https://docs.docker.com/get-docker/
[Docker Compose]: https://docs.docker.com/compose/install/
[Maven]: https://maven.apache.org/install.html
[Keycloak]: https://www.keycloak.org/docs/6.0/server_admin/
[Swagger API Documentation]: http://localhost:8080/swagger-ui.html
[Postman Collection]: data/postman/Charles%20Collection.postman_collection.json
[Butler]: https://github.com/ZupIT/charlescd/tree/master/butler
[Villager]: https://github.com/ZupIT/charlescd/tree/master/villager
[Circle Matcher]: https://github.com/ZupIT/charlescd/tree/master/circle-matcher
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md
[Documentation]: https://docs.charlescd.io/
