import { uniqWith } from 'lodash'
import { DeploymentEntityV2 } from '../api/deployments/entity/deployment.entity'
import { KubernetesManifest } from '../core/integrations/interfaces/k8s-manifest.interface'
import { HookParams, SpecMetadata, SpecStatus } from './params.interface'
import { CdConfiguration } from '../api/deployments/interfaces'


export class Reconcile {
  public concatWithPrevious(previousDeployment: DeploymentEntityV2, specs: KubernetesManifest[], configuration: CdConfiguration) : KubernetesManifest[] {
    const rawSpecs = previousDeployment.components.flatMap(c => c.manifests)
    const previousSpecs = this.addMetadata(rawSpecs, previousDeployment, configuration)
    const allSpecs = specs.concat(previousSpecs)
    const uniqByNameAndKind = uniqWith(allSpecs, (a, b) => a.metadata?.name === b.metadata?.name && a.kind === b.kind)
    return uniqByNameAndKind
  }

  public addMetadata(spec : KubernetesManifest[], deployment: DeploymentEntityV2, configuration: CdConfiguration) : KubernetesManifest[] {
    return spec.map((s: KubernetesManifest) => {
      if (s.metadata?.labels) {
        s.metadata.labels['deployment_id'] = deployment.id
        s.metadata.labels['circle_id'] = deployment.circleId
        s.metadata.name = `${s.metadata.name}-${deployment.circleId}`
        s.metadata.namespace = configuration.configurationData.namespace
      }
      return s
    })
  }

  public checkConditions(specs: { metadata: SpecMetadata, status: SpecStatus }[]): boolean {
    if (specs.length === 0) {
      return false
    }
    return specs.every(s => {
      if (s.status.conditions.length === 0) {
        return true
      }
      const conditions = s.status.conditions
      const minimumReplicaCondition = conditions.filter(c => c.type === 'Available' && c.reason === 'MinimumReplicasAvailable')
      const replicaSetAvailableCondition = conditions.filter(c => c.type === 'Progressing' && c.reason === 'NewReplicaSetAvailable')

      if (minimumReplicaCondition.length === 0) {
        return false
      }
      if (replicaSetAvailableCondition.length === 0) {
        return false
      }

      const allAvailable = minimumReplicaCondition.every(c => c.status === 'True')
      const allProgressing = replicaSetAvailableCondition.every(c => c.status === 'True')

      return allAvailable && allProgressing

    })
  }

  public specsByDeployment(params: HookParams, currentDeploymentId: string): { metadata: SpecMetadata, status: SpecStatus }[] {
    return Object.entries(params.children['Deployment.apps/v1'])
      .map(c => c[1])
      .filter(p => p.metadata.labels.deployment_id === currentDeploymentId)
  }

}
