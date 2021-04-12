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
import { DeploymentsHookController } from './controller/deployments.hook.controller'
import { RoutesHookController } from './controller/routes.hook.controller'
import { ReconcileRoutesUsecase } from './use-cases/reconcile-routes.usecase'
import { ReconcileDeploymentUsecase } from './use-cases/reconcile-deployment.usecase'

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
    ReconcileRoutesUsecase,
    ReconcileDeploymentUsecase,
    TimeoutScheduler
  ]
})

export class OperatorModule {
}
