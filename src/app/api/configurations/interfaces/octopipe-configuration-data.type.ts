import { GitProvidersEnum } from '../../../core/integrations/configuration/interfaces/git-providers.type'
import { ClusterProviderEnum } from '../../../core/integrations/octopipe/interfaces/octopipe-payload.interface'

export interface IEKSConfig {
    provider: ClusterProviderEnum.EKS
    caData: string
    awsSID: string
    awsSecret: string
    awsRegion: string
    awsClusterName: string
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export interface IGenericConfig {
    provider: ClusterProviderEnum.GENERIC
    host: string
    clientCertificate: string
    clientKey: string
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export interface IDefaultConfig {
    provider: ClusterProviderEnum.DEFAULT
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export type OctopipeConfigurationData = IEKSConfig | IGenericConfig | IDefaultConfig
