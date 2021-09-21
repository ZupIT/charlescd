import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import { AppConstants } from '../../core/constants'
import { plainToClass } from 'class-transformer'
import { K8sManifestWithSpec } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { CharlesCircle } from '../../core/integrations/k8s/interfaces/charles-routes.interface'

export class ResourceWrapper {

    private resource: KubernetesObject
    private spec?: Record<string, unknown>

    constructor(resource: KubernetesObject) {
      this.resource = resource
      this.spec = plainToClass(K8sManifestWithSpec, this.resource).spec
    }
    
    public get circles(): CharlesCircle[] {
      return this.isCharlesRoutes() ? this.spec?.circles as CharlesCircle[] : []
    }

    private isCharlesRoutes() {
      return this.resource.kind === AppConstants.CHARLES_CUSTOM_RESOURCE_ROUTES_KIND
    }

    private isCharlesDeployment() {
      return this.resource.kind === AppConstants.CHARLES_CUSTOM_RESOURCE_DEPLOYMENT_KIND
    }

    public get deploymentId(): string | undefined {
      const deploymentId = this.resource.metadata?.labels?.[AppConstants.DEPLOYMENT_ID_LABEL]
      if (deploymentId) {
        return deploymentId
      }
      return this.isCharlesDeployment() ? this.spec?.deploymentId as string : undefined
    }
}