import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { CdConfigurationsRepository } from '../api/configurations/repository/cd-configurations.repository'
import { ComponentsRepositoryV2 } from '../api/deployments/repository/component.repository'
import { DeploymentRepositoryV2 } from '../api/deployments/repository/deployment.repository'
import { KubernetesManifest } from '../core/integrations/interfaces/k8s-manifest.interface'
import { K8sClient } from '../core/integrations/k8s/client'
import { HookParams } from './params.interface'
import { Reconcile } from './reconcile'

@Controller('/')
export class DeploymentsHookController {

  constructor(
    private readonly k8sClient: K8sClient,
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentRepository: ComponentsRepositoryV2,
    private readonly configurationRepository: CdConfigurationsRepository
  ) { }

  @Post('/v2/operator/deployment/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams) : Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    const reconcile = new Reconcile()
    const deployment = await this.deploymentRepository.findOneOrFail({ id: params.parent.spec.deploymentId }, { relations: ['cdConfiguration', 'components'] })
    const decryptedConfig = await this.configurationRepository.findDecrypted(deployment.cdConfiguration.id)
    const rawSpecs = deployment.components.flatMap(c => c.manifests)
    const specs = reconcile.addMetadata(rawSpecs, deployment)

    if (isEmpty(params.children['Deployment.apps/v1'])) {
      return { children: specs, resyncAfterSeconds: 5 }
    }

    const currentDeploymentSpecs = reconcile.specsByDeployment(params, deployment.id)
    if (currentDeploymentSpecs === []) {
      const previousDeploymentId = deployment.previousDeploymentId

      if (previousDeploymentId === null) {
        return { children: specs, resyncAfterSeconds: 5 }
      }
      const previousDeployment = await this.deploymentRepository.findOneOrFail({ id: previousDeploymentId }, { relations: ['components'] })
      const s = reconcile.concatWithPrevious(previousDeployment, specs)
      return { children: s, resyncAfterSeconds: 5 }
    }
    const allReady = reconcile.checkConditions(currentDeploymentSpecs)
    if (allReady === false) {
      const previousDeploymentId = deployment.previousDeploymentId

      if (previousDeploymentId === null) {
        return { children: specs, resyncAfterSeconds: 5 }
      }
      const previousDeployment = await this.deploymentRepository.findOneOrFail({ id: previousDeploymentId }, { relations: ['components'] })
      const s = reconcile.concatWithPrevious(previousDeployment, specs)
      return { children: s, resyncAfterSeconds: 5 }
    }

    // rename active column to current
    // create new healthy column to represent the state of the deployment on the cluster
    const activeComponents = await this.componentRepository.findActiveComponents(deployment.cdConfiguration.id)
    await this.k8sClient.applyRoutingCustomResource(decryptedConfig.configurationData.namespace, activeComponents)
    return { children: specs }
  }

  @Post('/v2/operator/deployment/hook/finalize')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async finalize(@Body() params: HookParams): Promise<{ status?: unknown, children: [], finalized: boolean, resyncAfterSeconds?: number }> {
    const deployment = await this.deploymentRepository.findOneOrFail({ id: params.parent.spec.deploymentId }, { relations: ['cdConfiguration'] })
    const decryptedConfig = await this.configurationRepository.findDecrypted(deployment.cdConfiguration.id)
    const finalized = true
    const activeComponents = await this.componentRepository.findActiveComponents(deployment.cdConfiguration.id)
    await this.k8sClient.applyRoutingCustomResource(decryptedConfig.configurationData.namespace, activeComponents)

    // we cant trust that everything went well instantly, we need to keep returning finalized = true until we are sure there are no more routes to this deployment
    // const currentRoutes = this.k8sClient.getRoutingResource()
    // here we have to check if currentRoutes match the desired state based on activeComponents from database
    // if (checkRoutes(currentRoutes)) {
    // when everything is cleaned up update the database to signal the undeploy
    // finalized = true
    // }

    // if finalized = true metacontroller wont try to call this hook for this resource anymore, if finalize = false we return a resyncAfterSeconds to signal
    // in how much time metacontroller will call this same hook
    if (finalized) {
      return { children: [], finalized: finalized }
    }
    else {
      return { children: [], finalized: finalized, resyncAfterSeconds: 2 }
    }
  }
}

