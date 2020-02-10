import { ConfigurationConstants } from '../core/constants/application/configuration.constants'
import IEnvConfiguration from '../core/integrations/configuration/interfaces/env-configuration.interface'

export const Configuration: IEnvConfiguration = {
  postgresHost: process.env.DATABASE_HOST || ConfigurationConstants.DATABASE_HOST,

  postgresPort: Number(process.env.DATABASE_PORT) || ConfigurationConstants.DATABASE_PORT,

  postgresUser: process.env.DATABASE_USER || ConfigurationConstants.DATABASE_USER,

  postgresPass: process.env.DATABASE_PASS || ConfigurationConstants.DATABASE_DB_PASS,

  postgresDbName: process.env.DATABASE_NAME || ConfigurationConstants.DATABASE_DB_NAME,

  mooveUrl: process.env.MOOVE_URL || ConfigurationConstants.MOOVE_URL,

  darwinNotificationUrl: process.env.DARWIN_NOTIFICATION_URL || ConfigurationConstants.DARWIN_NOTIFICATION_URL,

  darwinUndeploymentCallbackUrl: process.env.DARWIN_UNDEPLOYMENT_CALLBACK || ConfigurationConstants.DARWIN_UNDEPLOYMENT_CALLBACK,

  darwinDeploymentCallbackUrl: process.env.DARWIN_DEPLOYMENT_CALLBACK || ConfigurationConstants.DARWIN_DEPLOYMENT_CALLBACK,

  spinnakerUrl: process.env.SPINNAKER_URL || ConfigurationConstants.SPINNAKER_URL,

  spinnakerGithubAccount: process.env.SPINNAKER_GITHUB_ACCOUNT || ConfigurationConstants.SPINNAKER_GITHUB_ACCOUNT,

  helmTemplateUrl: process.env.HELM_TEMPLATE_URL || ConfigurationConstants.HELM_TEMPLATE_URL,

  helmPrefixUrl: process.env.HELM_PREFIX_URL || ConfigurationConstants.HELM_PREFIX_URL,

  helmRepoBranch: process.env.HELM_REPO_BRANCH || ConfigurationConstants.HELM_REPO_BRANCH
}
