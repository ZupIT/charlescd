export class StatusManagementServiceStub {

    public async deepUpdateDeploymentStatus() {
        return
    }

    public async setComponentUndeploymentStatusAsFinished(): Promise<void> {
        return Promise.resolve()
    }

    public async setComponentUndeploymentStatusAsFailed(): Promise<void> {
        return Promise.resolve()
    }

    public async setComponentDeploymentStatusAsFinished(): Promise<void> {
        return Promise.resolve()
    }

    public async setComponentDeploymentStatusAsFailed(): Promise<void> {
        return Promise.resolve()
    }
}
