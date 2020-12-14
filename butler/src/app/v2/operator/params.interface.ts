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
    'Pod.v1': Record<string, childSpec>
  }
  finalizing: boolean
}

interface childSpec {
  name: string
  status: {
    containerStatuses: {
      ready: boolean
      restartCount: number
      started: boolean
    }
  }
}
