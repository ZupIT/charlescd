# CharlesCD Villager

Villager is a tool that abstracts many cloud providers and provides a unique API to integrate with container registries.

## How Villager works

* Villager has a pluggable architecture that enables the integration with Container Registries of different cloud providers.
* It abstracts every cloud provider API implementations.
* Provide a unique API to search for tags in your registry, or listen to your registry to check if a given image is being uploaded.

## How to use

### Requirements
 - [Java 11]
 - [Docker]
 - [Docker Compose]
 - [Maven]

### Running on terminal

Inside the root folder, run the following command:

```
docker-compose up
mvn clean install
mvn compile quarkus:dev
```

These commands will install all project dependencies, run two containers with a PostgreSQL database and a stub server and finally, start the application on port 8080.

Villager provides a [Swagger API Documentation], and also an up to date [Postman Collection].

## Documentation

Please check the [Charles Documentation].

## Contributing

Please check our [Contributing Guide].

[Java 11]: (https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
[Docker]: (https://docs.docker.com/get-docker/)
[Docker Compose]: (https://docs.docker.com/compose/)
[Maven]: (https://maven.apache.org/)
[Charles Documentation]: https://docs.charlescd.io/
[Swagger API Documentation]: http://localhost:8080/swagger-ui.html
[Postman Collection]: data/postman/CharlesCD_Villager.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md
