# **CharlesCD Moove**

Moove is CharlesCD's application responsible for orchestrating the hypothesis tests of your products and the delivery pipeline until it reaches your circles. It is the bridge between [**Butler**](https://github.com/ZupIT/charlescd/tree/main/butler), [**Villager**](https://github.com/ZupIT/charlescd/tree/main/villager), and [**Circle Matcher**](https://github.com/ZupIT/charlescd/tree/main/circle-matcher). 
 
## **How does Moove work?**

Through the Moove APIs, you can:
- Handle user access and permissions through user groups.
- Manage workspaces' configurations.
- Maintain your modules' configurations.
- Create circles, and define its segmentations and releases.
- Integrate with metric providers to monitor the health of your applications and explore your circle's evolution.
- Register your hypotheses and take advantage of the board managed by Moove to plan with your team the technical (or non-technical) activities for development.
- Use your hypotheses' board to automatically generate releases of all applications involved in the changes (even if they are in different branches).
 
## **Usage**

### **Requirements**
See below the requirements to run Moove:
- [**JDK 1.8+**](https://www.oracle.com/java/technologies/downloads/)
- [**Docker**](https://docs.docker.com/get-docker/)
- [**Docker Compose**](https://docs.docker.com/compose/install/)
- [**Maven**](https://maven.apache.org/download.cgi)
 
 ### **Configuration**

If you want to run your application locally with both authentication and authorization, the following information must be filled at **`application-local.properties`** file:
- **`charlescd.keycloak.realm`**: the name of your realm.
- **`charlescd.keycloak.serverUrl`**: the URL of your keycloak server (for example: `https://your-keycloak.com/auth`)
- **`charlescd.keycloak.clientId`**: a client identity token.
- **`charlescd.keycloak.clientSecret`**: the client secret.

All this information belongs to your [**Keycloak**](https://www.keycloak.org/docs/6.0/server_admin/) server.
                                     
After that, you have two options to start the application:

### **On your terminal**
Inside the root folder, run the following command:

```
docker-compose up
mvn clean install
./web/run-local.sh
```

### **Using your IDE**
Follow the steps below: 
**Step 1.** Run the command `docker-compose up` on your terminal;
**Step 2.** Set the property `spring.profiles.active` as `local`;
**Step 3.** Start the application.

After both approaches, the application will be available on port 8080. Additionally, two containers will be running: a PostgreSQL database and a stub server.
 
- Moove provides a [Swagger API Documentation](http://localhost:8080/swagger-ui.html), and an up to date [Postman Collection](https://www.postman.com/).

## **Documentation**

For more information about CharlesCD, please check out the [**documentation**](https://docs.charlescd.io/).

## **Contributing**

If you want to contribute to this module, access our [**Contributing Guide**](https://github.com/ZupIT/charlescd/blob/main/CONTRIBUTING.md).


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
