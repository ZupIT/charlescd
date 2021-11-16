
# **CharlesCD Butler**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**How does Butler work?**](#how-does-butler-work?)
### 3. [**Usage**](#usage)
>#### 3.1. [**Requirements**](#requirements)
>#### 3.2. [**Configuration**](#configuration)
### 4. [**Documentation**](#documentation)
### 5. [**Contributing**](#contributing)
### 6. [**License**](#license)
### 7. [**Community**](#community)

## **About**
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

2. These commands will install all project dependencies. Right after, you must: 
    - Run two containers with a PostgreSQL database and a stub server;
    - Start the application on port 3000.

A **Swagger API Documentation** is provided on application startup. We also provide an up to date [**Postman Collection**](https://www.postman.com/).

## **Documentation**

For more information about CharlesCD, please check out the [**documentation**](https://docs.charlescd.io/).

## **Contributing**

If you want to contribute to this module, access our [**Contributing Guide**](https://github.com/ZupIT/charlescd/blob/main/CONTRIBUTING.md).

### **Developer Certificate of Origin - DCO**

 This is a security layer for the project and for the developers. It is mandatory.
 
 Follow one of these two methods to add DCO to your commits:
 
**1. Command line**
 Follow the steps: 
 **Step 1:** Configure your local git environment adding the same name and e-mail configured at your GitHub account. It helps to sign commits manually during reviews and suggestions.

 ```
git config --global user.name “Name”
git config --global user.email “email@domain.com.br”
```
**Step 2:** Add the Signed-off-by line with the `'-s'` flag in the git commit command:

```
$ git commit -s -m "This is my commit message"
```

**2. GitHub website**
You can also manually sign your commits during GitHub reviews and suggestions, follow the steps below: 

**Step 1:** When the commit changes box opens, manually type or paste your signature in the comment box, see the example:

```
Signed-off-by: Name < e-mail address >
```

For this method, your name and e-mail must be the same registered on your GitHub account.

[Charles Documentation]: https://docs.charlescd.io/
[Node environment]: https://nodejs.org/en/
[Docker]: https://docs.docker.com/get-docker/
[Swagger API Documentation]: http://localhost:3000/api/swagger
[Postman Collection]: src/resources/postman/Charles_Butler.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

## **License**
[**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Community**

Do you have any question about CharlesCD? Let's chat in our [**forum**](https://forum.zup.com.br/).