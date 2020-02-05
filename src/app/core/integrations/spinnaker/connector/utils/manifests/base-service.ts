type AppName = string
type AppNamespace = string
type AppPort = number

interface ISpinnakerMetadata {
  labels?: { app: AppName, service: AppName }
  name: AppName
  namespace: AppNamespace
}

interface ISpinnakerPort {
  name: 'http',
  port: AppPort,
  targetPort: AppPort
}

export interface ISpinnakerBaseService {
  apiVersion: string
  kind: string
  metadata: ISpinnakerMetadata
  spec: { ports: ISpinnakerPort[], selector: {app: AppName}}
}

const baseService = (appName: AppName, appNamespace: AppNamespace, appPort: AppPort): ISpinnakerBaseService => (
  {
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
