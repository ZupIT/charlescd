export interface HookParams {
  controller: Record<string, unknown>
  parent: {
    apiVersion: 'zupit.com/v1'
    kind: 'CharlesDeployment'
    metadata: Record<string, unknown>
    spec: {
      circleId: string
      deploymentId: string
      components: { chat: string, name: string, tag: string }[]
    }
  }
  children: {
    'Deployment.apps/v1': DeploymentSpec,
    'Service.v1': ServiceSpec
  }
  finalizing: boolean
}

export interface SpecMetadata {
  labels: {
    app: string
    circle_id: string
    deployment_id: string
  }
}

export interface SpecStatus {
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

export interface DeploymentSpec {
  [key: string]: {
    metadata: SpecMetadata
    status: SpecStatus
  }
}

export interface ServiceSpec {
  [key: string]: {
    metadata: SpecMetadata
    status: {
      loadBalancer: Record<string, unknown>
    }
  }
}
