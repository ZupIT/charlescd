import { GitProvidersEnum } from '../../configuration/interfaces/git-providers.type'

export interface IOctopipeVersion {
  version: string
  versionUrl: string
}

export enum ClusterProviderEnum {
  EKS = 'EKS',
  GENERIC = 'GENERIC',
  DEFAULT = 'DEFAULT'
}

export interface IEKSClusterConfig {
  provider: ClusterProviderEnum.EKS
  awsSID: string
  awsSecret: string
  awsRegion: string
  awsClusterName: string
}

export interface IGenericClusterConfig {
  provider: ClusterProviderEnum.GENERIC
  clientCertificate: string
  clientKey: string
  caData: string
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
  k8s?: IEKSClusterConfig | IGenericClusterConfig
  circleId: string
}
