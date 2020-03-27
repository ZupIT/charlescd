export interface IOctopipeConfigurationData {

    gitProvider: 'github' | 'gitlab'

    gitToken: string

    k8sConfig: any

    namespace: string

    url: string
}
