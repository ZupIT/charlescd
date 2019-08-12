import { Module } from '@nestjs/common'
import { DeploymentsController } from './controller'
import { DeploymentsService } from './service'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from './entity'
import { ComponentEntity, ModuleEntity } from '../modules/entity'
import { DeploymentsStatusManagementService } from './service/deployments-status-management-service';

@Module({
  imports: [
    IntegrationsModule,
    TypeOrmModule.forFeature([
      DeploymentEntity,
      ModuleDeploymentEntity,
      ComponentDeploymentEntity,
      ModuleEntity,
      ComponentEntity
    ])
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService, DeploymentsStatusManagementService],
  exports: [DeploymentsService, DeploymentsStatusManagementService]
})
export class DeploymentsModule {}
