import { Module } from '@nestjs/common'
import { DeploymentsController } from './controller'
import { DeploymentsService } from './service'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Deployment, ModuleDeployment } from './entity'
import { ComponentDeployment } from './entity/component-deployment.entity'

@Module({
  imports: [
    IntegrationsModule,
    TypeOrmModule.forFeature([
      Deployment,
      ModuleDeployment,
      ComponentDeployment
    ])
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService]
})
export class DeploymentsModule {}
