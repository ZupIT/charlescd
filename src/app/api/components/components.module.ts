import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { ComponentsController } from './controller'
import { ComponentEntity } from './entity'
import { ComponentsService } from './services'
import { DeploymentsModule } from '../deployments/deployments.module'

@Module({
  imports: [
    IntegrationsModule,
    DeploymentsModule,
    TypeOrmModule.forFeature([
      ComponentEntity
    ])
  ],
  controllers: [ComponentsController],
  providers: [ComponentsService]
})
export class ComponentsModule {}
