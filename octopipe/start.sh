#!/bin/sh
set -e

touch kubeconfig.yaml
docker-compose -f docker-compose.yaml -f ../butler/docker-compose.yml up -d
./wait-for-it.sh -h localhost -p 5000 -- docker build . -f mock.Dockerfile -t localhost:5000/my-app && docker push localhost:5000/my-app
docker-compose -f docker-compose.yaml -f ../butler/docker-compose.yml logs -f
