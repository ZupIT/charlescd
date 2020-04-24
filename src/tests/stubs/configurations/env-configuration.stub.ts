import IEnvConfiguration from '../../../app/core/integrations/configuration/interfaces/env-configuration.interface'

export const EnvConfigurationStub: IEnvConfiguration = {

    postgresHost: 'postgreshost.com',

    postgresPort: 8000,

    postgresUser: 'postgresuser',

    postgresPass: 'postgrespass',

    postgresDbName: 'postgresdbname',

    mooveUrl: 'mooveurl.com',

    darwinDeploymentCallbackUrl: 'darwin-deployment-callback.url.com',

    darwinUndeploymentCallbackUrl: 'darwin-undeployment-callback.url.com',

    spinnakerUrl: 'spinnakerurl.com',

    octopipeUrl: 'octopipe.com',

    darwinNotificationUrl: 'darwin-notification.url.com',

    helmPrefixUrl: 'helm-prefix',

    helmRepoBranch: 'helm-branch',

    helmTemplateUrl: 'helm-template',

    spinnakerGithubAccount: 'spinnaker-github-account'
}
