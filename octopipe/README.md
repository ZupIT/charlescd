# CharlesCD Octopipe

Octopipe is a fast lightweight Kubernetes Continuous Deployment (CD) tool that aims to automate and manage the process of applying manifests into a cluster.

## How Octopipe works

* Octopipe allows the deployment of manifests into all of the main Kubernetes cloud providers (AWS, GPC, Azure).
* It has built-in integration with Helm Templates, allowing developers to specify their chart values in an external git repository.
* All deployment executions are persisted in a MongoDB database, fulfilling observability requirements that may appear.

## How to use

The pre-requisite for running Butler is that you have a working [Go environment] and [Docker] installed.

After that, clone this project and run the following commands inside the root folder:

```
docker-compose up
go run cmd/octopipe/main.go
```

This will start a MongoDB container running on port 27017 and the Octopipe application on port 8080 connected to it.

## Documentation

Please check the [Charles Documentation].

## Contributing 

Please check our [Contributing Guide].

[Charles Documentation]: https://docs.charlescd.io/
[Go environment]: https://golang.org/dl/
[Docker]: https://docs.docker.com/get-docker/
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md
