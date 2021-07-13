# CharlesCD Butler

Butler is a Kubernetes deployment tool that abstracts the routing feature of Istio service mesh in order to enable access to different application versions based on a custom header value.

## How Butler works

* Butler has a pluggable architecture that enables the usage of different Continuous Deployment (CD) tools that communicate with the Kubernetes cluster.
* It abstracts the state of the cluster inside its database, diminishing the coupling with Continuous Deployment (CD) tools, therefore allowing them to be changed without a problem.
* It has an easy to use API that enables the deployment of various applications at the same time in parallel.

## How to use

The pre-requisite for running Butler is that you have a working [Node environment] and [Docker] installed.

After that, clone this project and run the following commands inside the root folder:

```
npm install
docker-compose up
npm start
```

These commands will install all project dependencies, run two containers with a PostgreSQL database and a stub server and finally, start the application on port 3000.

A [Swagger API Documentation] is provided on application startup. We also provided a up to date [Postman Collection].

## Documentation

Please check the [Charles Documentation].

## Contributing

Please check our [Contributing Guide].

[Charles Documentation]: https://docs.charlescd.io/
[Node environment]: https://nodejs.org/en/
[Docker]: https://docs.docker.com/get-docker/
[Swagger API Documentation]: http://localhost:3000/api/swagger
[Postman Collection]: src/resources/postman/Darwin_Deploy.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

