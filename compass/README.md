# **CharlesCD Compass**

Compass is CharlesCD's application responsible for providing metrics through the connection with several data sources, in addition the application allows you to create actions based on the metrics consumed. The Compass also use a plugin architecture, which means that you can develop your own plugins for different data sources also create metrics-based actions plugins.

## **How does Compass work?**
Through the Compass APIs, you can:
- Integrate with metric providers to monitor the health of your applications and explore your circle's evolution.
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
If you want to run your application locally you will need a metric provider datasource running on the port 9090.

### **On your terminal**

Inside the root folder, run the following command:

```
docker-compose up
make start
```

### **Using your IDE**
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
