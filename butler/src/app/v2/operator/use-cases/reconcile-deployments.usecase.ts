import { Injectable } from '@nestjs/common'
import { uniqWith } from 'lodash'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { HookParams, SpecMetadata, SpecStatus } from '../params.interface'

@Injectable()
export class ReconcileDeployment {
  public concatWithPrevious(previousDeployment: DeploymentEntityV2, specs: KubernetesManifest[]) : KubernetesManifest[] {
    const rawSpecs = previousDeployment.components.flatMap(c => c.manifests)
    const previousSpecs = this.addMetadata(rawSpecs, previousDeployment)
    const allSpecs = specs.concat(previousSpecs)
    // TODO verify if this filter is necessary
    const uniqByNameAndKind = uniqWith(allSpecs, (a, b) => a.metadata?.name === b.metadata?.name && a.kind === b.kind)
    return uniqByNameAndKind
  }

  public addMetadata(spec : KubernetesManifest[], deployment: DeploymentEntityV2) : KubernetesManifest[] {
    return spec.map((s: KubernetesManifest) => {
      if (!s.metadata) {
        throw new Error('Invalid manifest. Field metadata is not present.')
      }

      if (s.kind === 'Deployment') { //TODO what about other resources such as StatefulSet, CronJob etc?
        s.metadata.name = `${s.metadata.name}-${deployment.circleId}`
      }

      s.metadata.namespace = deployment.namespace

      s.metadata.labels = {
        ...s.metadata.labels,
        'deploymentId': deployment.id,
        'circleId': deployment.circleId
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
      .filter(p => p.metadata.labels.deploymentId === currentDeploymentId)
  }

}
