import { uniqWith } from 'lodash'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { HookParams, SpecMetadata, SpecStatus } from '../interfaces/params.interface'
import { KubernetesObject } from '@kubernetes/client-node'
import { ComponentEntityV2 } from '../../api/deployments/entity/component.entity'

export class ReconcileUtils {

  public static concatWithPrevious(previousDeployment: DeploymentEntityV2, specs: KubernetesManifest[]): KubernetesManifest[] {
    const rawSpecs = previousDeployment.components.flatMap(c => c.manifests)
    const previousSpecs = ReconcileUtils.addMetadata(rawSpecs, previousDeployment)
    const allSpecs = specs.concat(previousSpecs)
    // TODO verify if this filter is necessary
    return uniqWith(allSpecs, ReconcileUtils.isNameAndKindEqual)
  }

  public static addMetadata(spec: KubernetesManifest[], deployment: DeploymentEntityV2): KubernetesManifest[] {
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

  public static checkConditions(specs: { metadata: SpecMetadata, status: SpecStatus }[]): boolean {
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

  public static specsByDeployment(params: HookParams, currentDeploymentId: string): { metadata: SpecMetadata, status: SpecStatus }[] {
    return Object.entries(params.children['Deployment.apps/v1'])
      .map(c => c[1])
      .filter(p => p.metadata.labels.deploymentId === currentDeploymentId)
  }

  public static getCreatedAtTimeDiff(component1: ComponentEntityV2, component2: ComponentEntityV2): number {
    return component1.deployment.createdAt.getTime() - component2.deployment.createdAt.getTime()
  }

  public static isNameAndKindEqual(manifest1: KubernetesObject, manifest2: KubernetesObject): boolean {
    return manifest1.metadata?.name === manifest2.metadata?.name && manifest1.kind === manifest2.kind
  }

  public static getComponentsServiceManifests(components: ComponentEntityV2[]): KubernetesObject[]  {
    return components.flatMap(c => c.manifests).filter(m => m.kind === 'Service')
  }
}
