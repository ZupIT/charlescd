# **CharlesCD Compass**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**How does Compass work?**](#how-does-compass-work?)
### 3. [**Usage**](#usage)
>#### 3.1. [**Requirements**](#requirements)
>#### 3.2. [**Configuration**](#configuration)
### 4. [**Documentation**](#documentation)
### 5. [**Contributing**](#contributing)
### 6. [**License**](#license)
### 7. [**Community**](#community)

## **About**
Compass is CharlesCD's application responsible for providing metrics through the connection with several data sources, in addition the application allows you to create actions based on the metrics consumed. Compass also uses a plugin architecture, which means that you can develop your own plugins for different data sources and also create metrics-based actions plugins.

## **How does Compass work?**
Through the Compass APIs, you can:
- Integrate with metric providers to monitor the health of your applications and explore your segmentation's (circle's) evolution.
- Set thresholds based on your application metrics.
- Create automated actions based on metrics and thresholds provided by your application.
- Use different types of data sources because of the architecture plugin.
- Develop your own actions plugins.

## **Usage**

### **Requirements**
See below the requirements to run Compass:

- [**Go 1.14**](https://golang.org/dl/)
- [**Docker**](https://docs.docker.com/get-docker/)
- [**Docker Compose**](https://docs.docker.com/compose/install/)
- [**GNU Make**](https://www.gnu.org/software/make/)

### **Configuration**
If you want to run your application locally, you will need a metric provider data source running on port 9090.

### **1. On your terminal**

Inside the root folder, run the following command:

```
docker-compose up
make start
```

### **2. Using your IDE**
Follow the steps below: 

**Step 1.** Run the command **`docker-compose up`** on your terminal;
**Step 2.** Set the **`cmd/main.go`** as your main file;
**Step 3.** Start the application.

After both approaches, the application will be available on port 8080. Additionally, one container will be running: a PostgreSQL database.
 
- Compass provides an up to date [**Postman Collection**](https://www.postman.com/).

### **Building the plugins**
Compass already comes with two data sources plugins and one action plugin by default:
#### **Data sources**
- [**Prometheus**](https://prometheus.io/)
- [**Google Analytics**](https://analytics.google.com/analytics/web/#/)

#### **Actions**
- **Circle Deployment**

#### **How to build your own plugin?** 
You only need to run the **`build-plugins.sh`** in compass root folder.


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

[Go 1.14]: https://golang.org/dl/
[Prometheus]: https://prometheus.io/
[Google Analytics]: https://analytics.google.com/
[Circle Deployment]: plugins/action/circledeployment/circledeployment.go
[GNU Make]: https://www.gnu.org/software/make/
[Docker]: https://docs.docker.com/get-docker/
[Docker Compose]: https://docs.docker.com/compose/install/
[Postman Collection]: resources/postman-collection.mod
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md
[Documentation]: https://docs.charlescd.io/

## **License**
[**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Community**

Do you have any question about CharlesCD? Let's chat in our [**forum**](https://forum.zup.com.br/). 