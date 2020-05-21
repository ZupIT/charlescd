# Charles Circle Matcher
      
## Prerequisites
 - `Java 11 >`
 - `Docker`
 - `Docker-compose`
 - `Maven`
## How to run application
  
 1. run `docker-compose up -d`
 2. run `mvn clean install`
 3. run `cd /target`
 4. run `java -jar charles-circle-matcher -Dspring.profiles.active=local`

## How to run test:
 1. run `mvn clean install`

## How to run on IDE 
 1. run `docker-compose up -d`
 2. set `spring.profiles.active=local` on IDE
