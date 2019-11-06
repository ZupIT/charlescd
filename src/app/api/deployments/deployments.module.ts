import { Module } from '@nestjs/common'
import { DeploymentsController } from './controller'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity,
  UndeploymentEntity
} from './entity'
import { ModuleEntity } from '../modules/entity'
import { ComponentEntity } from '../components/entity'
import { LogsModule } from '../../core/logs/logs.module'
import {
  ComponentDeploymentsRepository,
  QueuedDeploymentsRepository
} from './repository'
import {
  DeploymentsService,
  PipelineQueuesService,
  PipelinesService,
} from './services'
import { CreateUndeploymentRequestUsecase } from './use-cases'
import { QueuedUndeploymentEntity } from './entity/queued-undeployment.entity'
import { ServicesModule } from '../../core/services/services.module'

@Module({
  imports: [
    IntegrationsModule,
    LogsModule,
    ServicesModule,
    TypeOrmModule.forFeature([
      DeploymentEntity,
      ModuleDeploymentEntity,
      ComponentDeploymentEntity,
      ModuleEntity,
      ComponentEntity,
      QueuedDeploymentEntity,
      ComponentDeploymentsRepository,
      QueuedDeploymentsRepository,
      QueuedUndeploymentEntity,
      UndeploymentEntity
    ])
  ],
  controllers: [
    DeploymentsController
  ],
  providers: [
    DeploymentsService,
    PipelineQueuesService,
    PipelinesService,
    CreateUndeploymentRequestUsecase
  ],
  exports: [
    DeploymentsService,
    PipelineQueuesService,
    PipelinesService
  ]
})
export class DeploymentsModule {}
