#!/bin/sh
set -e

touch kubeconfig.yaml
docker-compose up -d
./wait-for-it.sh -h localhost -p 5000 -- docker build . -f mock.Dockerfile -t localhost:5000/my-app && docker push localhost:5000/my-app
docker-compose logs -f
