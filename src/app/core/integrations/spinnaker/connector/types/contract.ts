interface SpinnakerVersion {
  version: string
  versionUrl: string
}

interface SpinnakerCircle {
  destination: { version: string }
}

interface SpinnakerGithubConfig {
  helmTemplateUrl: string
  helmPrefixUrl: string
  helmRepoBranch: string
}

export default interface ISpinnakerContract {
  account: string
  pipelineName: string
  applicationName: string
  appName: string
  appNamespace: string
  healthCheckPath: string
  uri: { uriName: string }
  appPort: number
  webhookUri: string
  versions: SpinnakerVersion[]
  unusedVersions: SpinnakerVersion[]
  circles: SpinnakerCircle[]
  githubAccount: string
  githubConfig: SpinnakerGithubConfig
  circleId: string
}
