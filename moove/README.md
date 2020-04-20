# Darwin
  Project code-name: Darwin
      
## Modules
 - **Moove:** Awesome process management system.
 - **Deploy service:** Superb Cirle and Deploy management system.
 - **Metrics:** Magically gather metrics through your application.
 - **Credential:** Store your application credentials very securely in a vault.
    
## Prerequisites
 - `Java 8 >`
 - `Docker`
 - `Docker-compose`
 - `Maven`
## How to run application
  
##### Run the following commands:
 1. `make start` or `docker-compose up -d`
 2. `cd darwin-web`
 3. `./run-local.sh`

##### Run jar file:
 1. `make start` or `docker-compose up -d`
 2. `mvn clean install`
 3. `cd darwin-web`
 4. `./run-jar-local.sh`

## How to run test:
 1. `make start`
 2. `./run-tests.sh`

## How to run on IDE 
 1. run `make start` or `docker-compose up -d`
 2. set `spring.profiles.active=local` on IDE
 
## Entering on Swagger Web Interface

When your application is up, enter on address: http://localhost:8080/swagger-ui.html

 
### Enabling CORS
You can enable, and configure, CORS through the following properties:  

| Property                     | Description                                                                 | Type     | Default |
|------------------------------|-----------------------------------------------------------------------------|----------|---------|
| `zup.cors.enabled`           | If the cors configurator will be enabled                                    | Boolean  | false   |
| `zup.cors.mapping`           | Which path will be allowed to call the API. /** means all paths             | String   | /**     |
| `zup.cors.allowed-origins`   | The origins URL that will be allowed to call the API. * means everyone      | String[] | *       |
| `zup.cors.allowed-methods`   | The methods our API allows to be called by external API. * means any method | String[] | *       |
| `zup.cors.allowed-headers`   | The headers that are allowed to exchange with our API. * means any header   | String[] | *       |
| `zup.cors.exposed-headers`   | ... Don't know, but configurable                                            | String[] |         |
| `zup.cors.allow-credentials` | If preflight call can send cookies or auth stuff. Preferably leave it false | Boolean  | false   |
| `zup.cors.max-age`           | How long the preflight still valid before another preflight.                | Long     | 3600    |
