#!/bin/sh
set -e

touch kubeconfig.yaml
docker-compose -f docker-compose.yaml up
