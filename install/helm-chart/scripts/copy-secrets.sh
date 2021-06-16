# Change your namespace name
$YOUR_NAMESPACE="charlescd"
HOSTS= "moove butler"
for HOST in $HOSTS; do
kubectl get secret  -n $YOUR_NAMESPACE $HOST-tls-cert --export -o yaml > $HOST-secret.yaml
done


