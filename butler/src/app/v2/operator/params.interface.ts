export interface HookParams {
  controller: Record<string, unknown>
  parent: {
    apiVersion: 'zupit.com/v1'
    kind: 'CharlesDeployment'
    metadata: Record<string, unknown>
    spec: {
      circleId: string
      deploymentId: string
      components: { chart: string, name: string, tag: string }[]
    }
  }
  children: {
    'Deployment.apps/v1': DeploymentSpec,
    'Service.v1': Record<string, unknown>
  }
  finalizing: boolean
}

interface DeploymentSpec {
  [key: string]: {
    status: {
      availableReplicas: number
      conditions: {
        lastTransitionTime: string
        lastUpdateTime: string
        message: string
        reason: string
        status: 'True' | 'False' // TODO: check if this can be other values
        type: 'Progressing' | 'Available'  // TODO: check if this can be other values
      }[]
    }
  }
}
