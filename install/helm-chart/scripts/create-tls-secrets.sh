# Insert your domain
DOMAIN=".yourdomain.com"

# Insert the namespace you want create the secret
YOUR_NAMESPACE="charlescd"

# Insert the ca certificate path
CA_CERTIFICATE_PATH="path/ca.crt"

# Insert the butler private key path
BUTLER_KEY_PATH="path/butler.key"

# Insert the butler certificate path
BUTLER_CERTIFICATE_PATH="path/butler.crt"

# Insert the butler keystore
BUTLER_KEYSTORE_PATH="path/butler.jks"

# Insert the moove private key path
MOOVE_KEY_PATH="path/moove.key"

# Insert the moove certificate path
MOOVE_CERTIFICATE_PATH="path/moove.crt"

# Insert the moove keystore
MOOVE_KEYSTORE_PATH="path/moove.jks"

BUTLER_FQDN="butler$DOMAIN"
KEY_PASSWORD="charlescd"

kubectl -n $NAMESPACE create secret  generic butler-tls-cert
  --from-file=tls.crt=$BUTLER_CERTIFICATE_PATH
  --from-file=tls.key=$BUTLER_KEY_PATH
  --from-file=store.jks=$BUTLER_KEYSTORE_PATH
  --from-file=ca.crt=$CA_CERTIFICATE_PATH
  --from-literal=store_password=$KEY_PASSWORD


kubectl -n $NAMESPACE create secret  generic moove-tls-cert
  --from-file=tls.crt=$MOOVE_CERTIFICATE_PATH
  --from-file=tls.key=$MOOVE_KEY_PATH
  --from-file=store.jks=$MOOVE_KEYSTORE_PATH
  --from-file=ca.crt=$CA_CERTIFICATE_PATH
  --from-literal=store_password=$KEY_PASSWORD
