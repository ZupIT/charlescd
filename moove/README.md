# **CharlesCD Moove**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**How does Moove work?**](#how-does-moove-work?)
### 3. [**Usage**](#usage)
>#### 3.1. [**Requirements**](#requirements)
>#### 3.2. [**Configuration**](#configuration)
### 4. [**Documentation**](#documentation)
### 5. [**Contributing**](#contributing)
### 6. [**License**](#license)
### 7. [**Community**](#community)

## **About**
Moove is CharlesCD's application responsible for orchestrating the hypothesis tests of your products and the delivery pipeline until it reaches your segmentations. It is the bridge between [**Butler**](https://github.com/ZupIT/charlescd/tree/main/butler), [**Villager**](https://github.com/ZupIT/charlescd/tree/main/villager), and [**Circle Matcher**](https://github.com/ZupIT/charlescd/tree/main/circle-matcher). 
 
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

### **1. On your terminal**
Inside the root folder, run the following command:

```
docker-compose up
mvn clean install
./web/run-local.sh
```

### **2. Using your IDE**
Follow the steps below: 
**Step 1.** Run the command `docker-compose up` on your terminal;
**Step 2.** Set the property `spring.profiles.active` as `local`;
**Step 3.** Start the application.

After both approaches, the application will be available on port 8080. Additionally, two containers will be running: a PostgreSQL database and a stub server.
 
- Moove provides a [**Swagger API Documentation**](http://localhost:8080/swagger-ui.html), and an up to date [**Postman Collection**](https://www.postman.com/).

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

## **License**
[**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Community**

Do you have any question about CharlesCD? Let's chat in our [**forum**](https://forum.zup.com.br/). 

