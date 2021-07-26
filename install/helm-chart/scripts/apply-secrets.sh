# Change your namespace name
YOUR_NAMESPACE="charlescd"
HOSTS="moove butler"
for HOST in $HOSTS; do
kubectl -n $YOUR_NAMESPACE apply -f "$HOST"-secret.yaml
done
