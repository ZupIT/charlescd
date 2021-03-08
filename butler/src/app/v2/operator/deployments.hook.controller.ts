import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ComponentsRepositoryV2 } from '../api/deployments/repository/component.repository'
import { DeploymentRepositoryV2 } from '../api/deployments/repository/deployment.repository'
import { KubernetesManifest } from '../core/integrations/interfaces/k8s-manifest.interface'
import { K8sClient } from '../core/integrations/k8s/client'
import { HookParams } from './params.interface'
import { ReconcileDeploymentUsecase } from './use-cases/reconcile-deployment.usecase'

@Controller('/')
export class DeploymentsHookController {

  constructor(
    private readonly k8sClient: K8sClient,
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentRepository: ComponentsRepositoryV2,
    private readonly reconcileDeploymentUsecase: ReconcileDeploymentUsecase,
  ) { }

  @Post('/v2/operator/deployment/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams) : Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    return await this.reconcileDeploymentUsecase.execute(params)
  }

  @Post('/v2/operator/deployment/hook/finalize')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async finalize(): Promise<{ status?: unknown, children: [], finalized: boolean, resyncAfterSeconds?: number }> {
    const finalized = true
    const activeComponents = await this.componentRepository.findActiveComponents()
    await this.k8sClient.applyRoutingCustomResource(activeComponents)

    // TODO: Review all this placeholder logic
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

