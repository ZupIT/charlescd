#!/bin/sh

set -e

./wait-for-it.sh "vault:8200" -- echo "vault is up"
./wait-for-it.sh -t 0 "postgres:5432" -- echo "postgres is up"


mvn -Dmaven.repo.local=/home/maven/.m2/repository​ -f /home/application/pom.xml clean install -Dspring.profiles.active=ci,test