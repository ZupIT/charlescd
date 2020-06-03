#!/bin/bash

echo "Starting container..."
./wait-for-it.sh "0.0.0.0:5432" -- echo "postgres is up"

mvn clean install -U -DskipITs=false -Dspring.profiles.active=test
