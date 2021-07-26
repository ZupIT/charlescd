# Change your namespace name
sudo apt-get install jq
YOUR_NAMESPACE="charlescd"
HOSTS="moove butler"
for HOST in $HOSTS; do
  kubectl get secret -n $YOUR_NAMESPACE $HOST-tls-cert -ojson | jq 'del(.metadata.namespace,.metadata.resourceVersion,.metadata.uid) | .metadata.creationTimestamp=null' > "$HOST"-secret.yaml
done


