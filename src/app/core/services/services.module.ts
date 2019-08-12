import { Module } from '@nestjs/common'
import { DeploymentsStatusManagementService } from './deployments-status-management-service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from '../../api/deployments/entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeploymentEntity,
      ModuleDeploymentEntity,
      ComponentDeploymentEntity
    ])
  ],
  providers: [
    DeploymentsStatusManagementService
  ],
  exports: [
    DeploymentsStatusManagementService
  ]
})
export class ServicesModule {}
