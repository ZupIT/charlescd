#!/bin/bash

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

