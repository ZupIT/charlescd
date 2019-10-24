import { Module } from '@nestjs/common'
import { DeploymentsController } from './controller'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { ServicesModule } from '../../core/services/services.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity
} from './entity'
import { ModuleEntity } from '../modules/entity'
import { ComponentEntity } from '../components/entity'
import { LogsModule } from '../../core/logs/logs.module'
import {
  QueuedDeploymentsRepository,
  ComponentDeploymentsRepository
} from './repository'
import {
  DeploymentsService,
  PipelineQueuesService,
  PipelinesService,
  PipelineDeploymentService
} from './services'

@Module({
  imports: [
    IntegrationsModule,
    ServicesModule,
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
    PipelineDeploymentService
  ],
  exports: [
    DeploymentsService,
    PipelineQueuesService,
    PipelinesService,
    PipelineDeploymentService
  ]
})
export class DeploymentsModule {}
