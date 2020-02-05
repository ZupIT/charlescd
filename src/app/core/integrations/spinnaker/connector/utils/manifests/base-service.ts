const baseService = (
  appName,
  appNamespace,
  appPort
) => ({
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    labels: {
      app: appName,
      service: appName
    },
    name: appName,
    namespace: appNamespace
  },
  spec: {
    ports: [
      {
        name: 'http',
        port: appPort,
        targetPort: appPort
      }
    ],
    selector: {
      app: appName
    }
  }
})

export default baseService
