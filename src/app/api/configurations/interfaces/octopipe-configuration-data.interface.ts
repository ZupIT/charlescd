export interface IOctopipeConfigurationData {

    git: {
        provider: 'github' | 'gitlab',
        token: string
    }

    k8s: {
        config: any
    }

    namespace: string

    url: string
}
