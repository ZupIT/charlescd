import { GitProvidersEnum } from '../../configuration/interfaces/git-providers.type'

export interface IOctopipeVersion {
  version: string
  versionUrl: string
}

interface IEKSClusterConfig {
  provider: 'EKS'
  caData: string
  awsSID: string
  awsSecret: string
  awsRegion: string
  awsClusterName: string
}

interface IDefaultClusterConfig {
  provider: 'GENERIC'
  clientCertificate: string
  host: string
}

export interface IOctopipePayload {
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
    provider: GitProvidersEnum,
    token: string
  },
  helmUrl: string,
  k8s?: IEKSClusterConfig | IDefaultClusterConfig
  circleId: string
}
