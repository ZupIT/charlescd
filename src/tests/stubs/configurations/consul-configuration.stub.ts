import { IConsulKV } from '../../../app/core/integrations/consul/interfaces'
import IEnvConfiguration from '../../../app/core/integrations/configuration/interfaces/env-configuration.interface'

export const ConsulConfigurationStub: IEnvConfiguration = {

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
