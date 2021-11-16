# **CharlesCD Villager**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**How does Villager work?**](#how-does-villager-work?)
### 3. [**Usage**](#usage)
>#### 3.1. [**Requirements**](#requirements)
>#### 3.2. [**Configuration**](#configuration)
### 4. [**Documentation**](#documentation)
### 5. [**Contributing**](#contributing)
### 6. [**License**](#license)
### 7. [**Community**](#community)

## **About**
Villager is a tool that abstracts multiple cloud providers to provide a unique API to integrate with container registries.

## **How does Villager work?**

* Villager has a pluggable architecture that enables the integration with Container Registries of different cloud providers.
* It abstracts every cloud provider API implementation.
* Provides a single API to search for tags and listen to your registry checking if an image has been uploaded.

## **Usage**

### **Requirements**
See below the requirements to run Villager:

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

These commands will install all project dependencies, run two containers with a PostgreSQL database and a stub server and, finally, start the application on port 8080.

- Villager provides a [**Swagger API Documentation**](http://localhost:8080/swagger-ui.html), and an up to date [**Postman Collection**](https://www.postman.com/).

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

[Java 11]: https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
[Docker]: https://docs.docker.com/get-docker/
[Docker Compose]: https://docs.docker.com/compose/
[Maven]: https://maven.apache.org/
[Charles Documentation]: https://docs.charlescd.io/
[Swagger API Documentation]: http://localhost:8080/swagger-ui
[Postman Collection]: data/postman/CharlesCD_Villager.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

## **License**
[**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Community**

Do you have any question about CharlesCD? Let's chat in our [**forum**](https://forum.zup.com.br/). 