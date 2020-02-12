import {
  forwardRef,
  Module
} from '@nestjs/common'
import { DeploymentsController } from './controller'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity,
  QueuedUndeploymentEntity,
  UndeploymentEntity
} from './entity'
import { ModuleEntity } from '../modules/entity'
import { ComponentEntity } from '../components/entity'
import { LogsModule } from '../../core/logs/logs.module'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from './repository'
import {
  DeploymentsService,
  PipelineDeploymentsService,
  PipelineErrorHandlingService,
  PipelineQueuesService
} from './services'
import {
  CreateCircleDeploymentRequestUsecase,
  CreateDefaultDeploymentRequestUsecase,
  CreateUndeploymentRequestUsecase
} from './use-cases'
import { ServicesModule } from '../../core/services/services.module'
import { DeploymentUniquenessPipe } from './pipes'

@Module({
  imports: [
    forwardRef(() => IntegrationsModule),
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
      UndeploymentEntity,
      ComponentUndeploymentsRepository
    ])
  ],
  controllers: [
    DeploymentsController
  ],
  providers: [
    DeploymentsService,
    PipelineQueuesService,
    PipelineDeploymentsService,
    PipelineErrorHandlingService,
    CreateUndeploymentRequestUsecase,
    CreateCircleDeploymentRequestUsecase,
    CreateDefaultDeploymentRequestUsecase,
    DeploymentUniquenessPipe
  ],
  exports: [
    DeploymentsService,
    PipelineQueuesService,
    PipelineErrorHandlingService
  ]
})
export class DeploymentsModule {}
