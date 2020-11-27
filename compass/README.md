# CharlesCD Compass

Compass is CharlesCD's application responsible for providing metrics through the connection with several data sources, in addition the application allows you to create actions based on the metrics consumed. The Compass also use a plugin architecture, which means that you can develop your own plugins for different data sources also create metrics-based actions plugins.

## How Compass Works
Through the Compass APIs, you can explore it to:
- Integrate with metric providers to monitor the health of your applications and explore your circle's evolution.
- Set thresholds based on your application metrics.
- Create automated actions based on metrics and thresholds provided by your application.
- Use different types of data sources thanks to plugin architecture.
- Develop your own actions plugins.

## How to Use

### Requirements
 - [Go 1.14]
 - [Docker]
 - [Docker Compose]
 - [GNU Make]

Once all the prerequisites were installed, if you want to run your application locally you will need a metric provider datasource running on the port 9090.

### Building the plugins
Compass already comes with two data sources plugins and one action plugin by default:
#### Data sources
- [Prometheus]
- [Google Analytics]
#### Actions
- [Circle Deployment]

To build the plugin you only need to run the `build-plugins.sh` in compass root folder.

### On terminal

Inside the root folder, run the following command:

```
docker-compose up
make start
```

### Using your IDE
Once you run the command `docker-compose up` on your terminal, set the `cmd/main.go` as your main file and start the application.

After both approaches, the application will be available on port 8080. Additionally, one container will be running: a PostgreSQL database.
 
Compass provides a up to date [Postman Collection].

## Documentation

Please check our [Documentation].

## Contributing

Please check our [Contributing Guide].

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
