import { HttpModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeploymentEntityV2 } from '../api/deployments/entity/deployment.entity'
import { ComponentsRepositoryV2 } from '../api/deployments/repository/component.repository'
import { DeploymentRepositoryV2 } from '../api/deployments/repository/deployment.repository'
import { ExecutionRepository } from '../api/deployments/repository/execution.repository'
import { K8sClient } from '../core/integrations/k8s/client'
import { MooveService } from '../core/integrations/moove'
import { LogsModule } from '../core/logs/logs.module'
import { TimeoutScheduler } from './cron/timeout.scheduler'
import { DeploymentsHookController } from './deployments.hook.controller'
import { RoutesHookController } from './routes.hook.controller'
import { CreateRoutesManifestsUseCase } from './use-cases/create-routes-manifests.usecase'
import { ReconcileDeploymentUsecase } from './use-cases/reconcile-deployment.usecase'
import { ReconcileDeployment } from './use-cases/reconcile-deployments.usecase'


@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeploymentEntityV2,
      DeploymentRepositoryV2,
      ComponentsRepositoryV2,
      ExecutionRepository
    ]),
    LogsModule,
    HttpModule
  ],
  controllers: [
    DeploymentsHookController,
    RoutesHookController
  ],
  providers: [
    K8sClient,
    MooveService,
    CreateRoutesManifestsUseCase,
    ReconcileDeploymentUsecase,
    ReconcileDeployment,
    TimeoutScheduler
  ]
})
export class OperatorModule {
}
