import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common'
import { HookParams } from './params.interface'
import { DeploymentRepositoryV2 } from '../api/deployments/repository/deployment.repository'
import { KubernetesManifest } from '../core/integrations/interfaces/k8s-manifest.interface'
import { Component } from '../api/deployments/interfaces'
import { DeploymentUtils } from '../core/integrations/utils/deployment.utils'
import { IstioDeploymentManifestsUtils } from '../core/integrations/utils/istio-deployment-manifests.utils'
import { ComponentsRepositoryV2 } from '../api/deployments/repository'

@Controller('/')
export class RoutesHookController {

  constructor(
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentsRepository: ComponentsRepositoryV2
  ) {}

  @Post('/v2/operator/routes/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams): Promise<{ status?: unknown, children: KubernetesManifest[] | [] }> {
    const deployment = await this.deploymentRepository.findOneOrFail({ id: params.parent.spec.deploymentId }, { relations: ['cdConfiguration', 'components'] })
    const activeComponents = await this.componentsRepository.findActiveComponents(deployment.cdConfiguration.id)

    const proxySpecs: KubernetesManifest[] = []
    deployment.components.forEach(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
      proxySpecs.push(IstioDeploymentManifestsUtils.getDestinationRulesManifest(deployment, component, activeByName))
      proxySpecs.push(IstioDeploymentManifestsUtils.getVirtualServiceManifest(deployment, component, activeByName))
    })

    return { children: proxySpecs }
  }
}
