#!/bin/sh
set -e

EXEC='sh -c'

START_TIME=`date "+%s"`

echo '### Setup k3s'
# docker-compose up -d
${EXEC} 'until kubectl wait --for=condition=available deployment/coredns -n kube-system; do sleep 1; done' 2>/dev/null
echo

# echo "### Setup OpenEBS"
# ${EXEC} 'kubectl create namespace openebs'
# ${EXEC} 'kubectl apply -f-' < manifests/openebs.yaml
# ${EXEC} 'until kubectl wait --for=condition=available deployment/openebs-admission-server -n openebs; do sleep 1; done' 2>/dev/null
# ${EXEC} 'until kubectl wait --for=condition=available deployment/openebs-apiserver -n openebs; do sleep 1; done' 2>/dev/null
# ${EXEC} 'until kubectl wait --for=condition=available deployment/openebs-localpv-provisioner -n openebs; do sleep 1; done' 2>/dev/null
# ${EXEC} 'until kubectl wait --for=condition=available deployment/openebs-ndm-operator -n openebs; do sleep 1; done' 2>/dev/null
# ${EXEC} 'until kubectl wait --for=condition=available deployment/openebs-provisioner -n openebs; do sleep 1; done' 2>/dev/null
# ${EXEC} "kubectl patch storageclass openebs-hostpath -p '{\"metadata\": {\"annotations\":{\"storageclass.kubernetes.io/is-default-class\":\"true\"}}}'"
# echo

echo "### Setup Istio"
${EXEC} 'kubectl create namespace istio-system'
${EXEC} 'kubectl apply -f-' < manifests/istio-init.yaml
${EXEC} 'until kubectl wait --for=condition=complete job/istio-init-crd-10 -n istio-system; do sleep 1; done' 2>/dev/null
${EXEC} 'until kubectl wait --for=condition=complete job/istio-init-crd-11 -n istio-system; do sleep 1; done' 2>/dev/null
${EXEC} 'until kubectl wait --for=condition=complete job/istio-init-crd-12 -n istio-system; do sleep 1; done' 2>/dev/null
${EXEC} 'until kubectl wait --for=condition=complete job/istio-init-crd-certmanager-10 -n istio-system; do sleep 1; done' 2>/dev/null
${EXEC} 'until kubectl wait --for=condition=complete job/istio-init-crd-certmanager-11 -n istio-system; do sleep 1; done' 2>/dev/null
${EXEC} 'kubectl apply -f-' < manifests/istio.yaml
${EXEC} 'kubectl apply -f-' < manifests/cert-manager-issuers.yaml
${EXEC} 'until kubectl wait --for=condition=available deployment/istio-pilot -n istio-system; do sleep 1; done' 2>/dev/null
${EXEC} 'until kubectl wait --for=condition=available deployment/istio-policy -n istio-system; do sleep 1; done' 2>/dev/null
${EXEC} 'until kubectl wait --for=condition=available deployment/istio-sidecar-injector -n istio-system; do sleep 1; done' 2>/dev/null
echo

END_TIME=`date "+%s"`

echo "### Running time: $((${END_TIME} - ${START_TIME}))s"
sleep infinity
