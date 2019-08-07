import { Module } from '@nestjs/common'
import { DeploymentsController } from './controller/deployments.controller'
import { DeploymentsService } from './service'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Deployment } from './entity/deployment.entity'
import { DeploymentModule } from './entity/deployment-module.entity'

@Module({
  imports: [
    IntegrationsModule,
    TypeOrmModule.forFeature([
      Deployment,
      DeploymentModule
    ])
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService]
})
export class DeploymentsModule {}
