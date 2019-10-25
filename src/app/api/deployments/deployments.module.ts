import { Module } from '@nestjs/common'
import { DeploymentsController } from './controller'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity } from './entity'
import { ModuleEntity } from '../modules/entity'
import { ComponentEntity } from '../components/entity'
import { LogsModule } from '../../core/logs/logs.module'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from './repository'
import {
  DeploymentsService,
  PipelineQueuesService,
  PipelinesService,
  StatusManagementService
} from './services'
import { CreateUndeploymentRequestUsecase } from './use-cases'

@Module({
  imports: [
    IntegrationsModule,
    LogsModule,
    TypeOrmModule.forFeature([
      DeploymentEntity,
      ModuleDeploymentEntity,
      ComponentDeploymentEntity,
      ModuleEntity,
      ComponentEntity,
      QueuedDeploymentEntity,
      ComponentDeploymentsRepository,
      QueuedDeploymentsRepository
    ])
  ],
  controllers: [
    DeploymentsController
  ],
  providers: [
    DeploymentsService,
    PipelineQueuesService,
    PipelinesService,
    CreateUndeploymentRequestUsecase,
    StatusManagementService
  ],
  exports: [
    DeploymentsService,
    PipelineQueuesService,
    PipelinesService,
    StatusManagementService
  ]
})
export class DeploymentsModule {}
