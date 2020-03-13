export class K8sConfigurationDataEntity {

    public account: string

    public namespace: string

    constructor(
        account: string,
        namespace: string
    ) {
        this.account = account
        this.namespace = namespace
    }
}
