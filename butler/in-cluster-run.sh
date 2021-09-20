echo "Loading helm and kubectl..."
HELM_KUBECTL="helm-kubectl"
CLUSTER_NAME="charles"
KUBECONFIG_PATH="kind-config.yaml"

 docker run -it -d \
      --entrypoint '/bin/sh' \
      --network host \
      --name $HELM_KUBECTL \
      dtzar/helm-kubectl:3.5.4

echo "Verifying kind installation..."
if ! [ -x "$(command -v kind)" ]; then
  echo "Kind not installed. Installing..."
  curl -ssLo /tmp/kind https://kind.sigs.k8s.io/dl/v0.11.1/kind-linux-amd64
  chmod +x /tmp/kind
  mv /tmp/kind  /usr/local/bin/kind
fi
echo "Creating kind cluster..."
CLUSTER=$(kind get clusters)
if [ -z "$CLUSTER" ]; then
kind create cluster $CLUSTER_NAME
fi
 kind get kubeconfig > "$KUBECONFIG_PATH"
echo $KUBECONFIG

docker exec -i $HELM_KUBECTL mkdir -p /root/.kube
docker cp "$KUBECONFIG_PATH" $HELM_KUBECTL:/root/.kube/config
docker exec -i $HELM_KUBECTL kubectl get ns

echo "Applying dependencies manifests..."

docker exec -i $HELM_KUBECTL kubectl apply -f src/resources/cluster
#docker build -t butler:test .


