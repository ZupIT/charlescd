# **CharlesCD Villager**

Villager is a tool that abstracts multiple cloud providers to provide a unique API to integrate with container registries.

## **How does Villager work?**

* Villager has a pluggable architecture that enables the integration with Container Registries of different cloud providers.
* It abstracts every cloud provider API implementation.
* Provides a single API to search for tags and listen to your registry checking if an image has been uploaded.

## **Usage**

### **Requirements**
- [**Java 11**](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [**Docker**](https://docs.docker.com/get-docker/)
- [**Docker Compose**](https://docs.docker.com/compose/install/)
- [**Maven**](https://maven.apache.org/download.cgi)

### **Configuration**

### **Run on your terminal**

Inside the root folder, run the following command:

```
docker-compose up
mvn clean install
mvn compile quarkus:dev
```

These commands will install all project dependencies, run two containers with a PostgreSQL database and a stub server and finally, start the application on port 8080.

- Villager provides a [**Swagger API Documentation**](http://localhost:8080/swagger-ui.html), and an up to date [**Postman Collection**](https://www.postman.com/).

## **Documentation**

For more information about CharlesCD, please check out the [**documentation**](https://docs.charlescd.io/).

## **Contributing**

If you want to contribute to this module, access our [**Contributing Guide**](https://github.com/ZupIT/charlescd/blob/main/CONTRIBUTING.md).


[Java 11]: https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
[Docker]: https://docs.docker.com/get-docker/
[Docker Compose]: https://docs.docker.com/compose/
[Maven]: https://maven.apache.org/
[Charles Documentation]: https://docs.charlescd.io/
[Swagger API Documentation]: http://localhost:8080/swagger-ui
[Postman Collection]: data/postman/CharlesCD_Villager.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

