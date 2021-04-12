import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { HookParams } from '../interfaces/params.interface'
import { ReconcileDeploymentUsecase } from '../use-cases/reconcile-deployment.usecase'

@Controller('/')
export class DeploymentsHookController {

  constructor(
    private readonly reconcileDeploymentUsecase: ReconcileDeploymentUsecase,
  ) { }

  @Post('/v2/operator/deployment/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams) : Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    return await this.reconcileDeploymentUsecase.execute(params)
  }
}

