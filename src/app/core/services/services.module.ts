import { Module } from '@nestjs/common'
import { DeploymentsStatusManagementService } from './deployments-status-management-service'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../api/deployments/entity'
import {
  ComponentDeploymentsRepository
} from '../../api/deployments/repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeploymentEntity,
      ModuleDeploymentEntity,
      ComponentDeploymentEntity,
      ComponentDeploymentsRepository
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
