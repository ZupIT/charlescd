import { GitProviders } from '../../../core/integrations/configuration/interfaces/git-providers.type'

export interface IOctopipeConfigurationData {

    gitProvider: GitProviders

    gitToken: string

    k8sConfig: any

    namespace: string

    url: string
}
