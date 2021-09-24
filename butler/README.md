# **CharlesCD Butler**

Butler is a Kubernetes deployment tool that abstracts the routing feature of Istio's service mesh. It enables access to different applications versions based on a custom header value.

## **How does Butler work?** 

* Butler has a pluggable architecture and enables different Continuous Deployment (CD) tools that communicate with the Kubernetes cluster.
* It abstracts the state of the cluster inside its database, diminishing the coupling with Continuous Deployment (CD) tools, therefore allowing them to be changed without a problem.
* It has an easy-to-use API that enables the deployment of various applications at the same time.

## **Usage**

### **Requirements**
See below the requirements to run Butler: 
- A working [**Node environment**](https://nodejs.org/en/);
- [**Docker**](https://docs.docker.com/get-docker/) installed.


### **Configuration**

1. Clone this project and run the following commands inside the root folder:

```
npm install
docker-compose up
npm start
```

2. These commands will install all project dependencies:
    - Run two containers with a PostgreSQL database and a stub server;
    - Start the application on port 3000.

A **Swagger API Documentation** is provided on application startup. We also provided a up to date [**Postman Collection**](https://www.postman.com/).

## **Documentation**

For more information about CharlesCD, please check out the [**documentation**](https://docs.charlescd.io/).

## **Contributing**

If you want to contribute to this module, access our [**Contributing Guide**](https://github.com/ZupIT/charlescd/blob/main/CONTRIBUTING.md).

[Charles Documentation]: https://docs.charlescd.io/
[Node environment]: https://nodejs.org/en/
[Docker]: https://docs.docker.com/get-docker/
[Swagger API Documentation]: http://localhost:3000/api/swagger
[Postman Collection]: src/resources/postman/Charles_Butler.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

