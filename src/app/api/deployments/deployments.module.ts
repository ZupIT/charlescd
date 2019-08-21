import { Module } from '@nestjs/common'
import { DeploymentsController } from './controller'
import { DeploymentsService } from './service'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { ServicesModule } from '../../core/services/services.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from './entity'
import { ComponentEntity, ModuleEntity } from '../modules/entity'
import { LogsModule } from '../../core/logs/logs.module'
import { QueuedDeploymentsRepository } from './repository'
import { QueuedDeploymentsService } from './service/queued-deployments.service'
import { PipelineProcessingService } from './service/pipeline-processing.service'

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
      QueuedDeploymentsRepository
    ])
  ],
  controllers: [DeploymentsController],
  providers: [
    DeploymentsService,
    QueuedDeploymentsService,
    PipelineProcessingService
  ],
  exports: [
    DeploymentsService,
    QueuedDeploymentsService,
    PipelineProcessingService
  ]
})
export class DeploymentsModule {}
