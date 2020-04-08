import { GitProvidersEnum } from '../../../core/integrations/configuration/interfaces/git-providers.type'

export interface IEKSConfig {
    provider: 'EKS'
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
    provider: 'GENERIC'
    host: string
    clientCertificate: string
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export interface IDefaultConfig {
    provider: 'DEFAULT'
    gitProvider: GitProvidersEnum
    gitToken: string
    namespace: string
}

export type OctopipeConfigurationData = IEKSConfig | IGenericConfig | IDefaultConfig
