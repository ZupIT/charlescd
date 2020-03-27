import { GitProviders } from './git-providers.type'

export interface IOctopipeVersion {
  version: string
  versionUrl: string
}

export interface IOctopipePayload {
  hosts?: string[],
  versions: IOctopipeVersion[],
  unusedVersions: IOctopipeVersion[],
  istio: {
    virtualService: {},
    destinationRules: {}
  },
  appName: string,
  appNamespace: string
  webHookUrl: string,
  git: {
    provider: GitProviders,
    token: string
  },
  helmUrl: string,
  k8s: {
    config: string
  }
}
