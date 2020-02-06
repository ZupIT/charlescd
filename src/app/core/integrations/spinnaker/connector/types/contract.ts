import { IPipelineCircle } from '../../../../../api/components/interfaces'

interface SpinnakerVersion {
  version: string
  versionUrl: string
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
  circles: IPipelineCircle[]
  githubAccount: string
  githubConfig: SpinnakerGithubConfig
  circleId: string
  hosts?: string[]
}
