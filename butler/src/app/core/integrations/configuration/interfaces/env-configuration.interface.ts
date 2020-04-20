export default interface IEnvConfiguration {

  postgresHost?: string

  postgresPort?: number

  postgresUser?: string

  postgresPass?: string

  postgresDbName?: string

  mooveUrl?: string

  darwinNotificationUrl?: string

  darwinUndeploymentCallbackUrl?: string

  darwinDeploymentCallbackUrl?: string

  spinnakerUrl?: string

  octopipeUrl?: string

  spinnakerGithubAccount?: string

  helmTemplateUrl?: string

  helmPrefixUrl?: string

  helmRepoBranch?: string
}
