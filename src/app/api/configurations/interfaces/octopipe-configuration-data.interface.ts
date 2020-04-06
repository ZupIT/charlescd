import { GitProvidersEnum } from '../../../core/integrations/configuration/interfaces/git-providers.type'

export interface IEKSConfig {
    provider: 'EKS'
    caData: string
    awsSID: string
    awsSecret: string
    awsRegion: string
    awsClusterName: string
}

export interface IGenericConfig {
    provider: 'GENERIC'
    host: string
    clientCertificate: string
}

export interface IOctopipeConfigurationData {

    gitProvider: GitProvidersEnum

    gitToken: string

    k8sConfig: IEKSConfig | IGenericConfig

    namespace: string
}
