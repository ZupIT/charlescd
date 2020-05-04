import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { ComponentsController } from './controller'
import { ComponentEntity } from './entity'
import { DeploymentsModule } from '../deployments/deployments.module'
import { GetComponentQueueUseCase } from './use-cases/get-component-queue.usecase'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../deployments/repository'

@Module({
  imports: [
    IntegrationsModule,
    DeploymentsModule,
    TypeOrmModule.forFeature([
      ComponentEntity,
      ComponentDeploymentsRepository,
      QueuedDeploymentsRepository
    ])
  ],
  controllers: [ComponentsController],
  providers: [GetComponentQueueUseCase]
})
export class ComponentsModule {}
