import { GitProvidersEnum } from '../../../core/integrations/configuration/interfaces/git-providers.type'

export interface IOctopipeConfigurationData {

    gitProvider: GitProvidersEnum

    gitToken: string

    k8sConfig: string

    namespace: string
}
