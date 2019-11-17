import { IConsulKV } from '../../../app/core/integrations/consul/interfaces'

export const ConsulConfigurationStub: IConsulKV = {

    postgresHost: 'postgreshost.com',

    postgresPort: 8000,

    postgresUser: 'postgresuser',

    postgresPass: 'postgrespass',

    postgresDbName: 'postgresdbname',

    mooveUrl: 'mooveurl.com',

    darwinDeploymentCallbackUrl: 'darwin-deployment-callback.url.com',

    darwinUndeploymentCallbackUrl: 'darwin-undeployment-callback.url.com',

    spinnakerUrl: 'spinnakerurl.com'
}
