s3:
  enabled: true
  bucket: "${bucket}"
  region: "${region}"
  endpoint: ""

halyard:
  additionalScripts:
    enabled: false
    configMapName: my-halyard-config
    configMapKey: config.sh
    create: true
    data: 
      config.sh: |-
        $HAL_COMMAND config security ui edit --no-validate --override-base-url https://${tyk-address-spinnakerdeck}
        $HAL_COMMAND config security api edit --no-validate --override-base-url https://${tyk-address-spinnakergate}
        $HAL_COMMAND config artifact github enable 
        $HAL_COMMAND config artifact github account add github-artifact --token ${token-github}
        $HAL_COMMAND config provider kubernetes account edit default --live-manifest-calls true

  additionalProfileConfigMaps:
      data:
        gate-local.yml: |-
          redis:
            configuration:
              secure: true

minio:
  enabled: false

redis:
  enabled: false
  cluster:
    enabled: false
  external:
    host: "${redis_host}"
    port: "${redis_port}"
    password: "${redis_pass}"