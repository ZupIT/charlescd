#!/bin/sh
set -e

EXEC='sh -c'

START_TIME=`date "+%s"`

echo '### Setup k3s'
# docker-compose up -d
${EXEC} 'until kubectl wait --for=condition=available deployment/coredns -n kube-system; do sleep 1; done' 2>/dev/null
echo

echo "### Setup CRDs"
${EXEC} 'kubectl apply -f-' < manifests/charlescd-butler-deployment-crd.yaml
${EXEC} 'kubectl apply -f-' < manifests/charlescd-butler-routes-crd.yaml
echo

END_TIME=`date "+%s"`

echo "### Running time: $((${END_TIME} - ${START_TIME}))s"
sleep infinity
