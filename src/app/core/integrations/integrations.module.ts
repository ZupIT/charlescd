import { HttpModule, Module } from '@nestjs/common'
import { SpinnakerService } from './spinnaker'
import { DeploymentConfigurationService } from './configuration'
import { MooveService } from './moove'
import { LogsModule } from '../logs/logs.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity } from '../../api/deployments/entity'
import { ComponentDeploymentsRepository } from '../../api/deployments/repository'
import { DatabasesService } from './databases'

@Module({
  imports: [
    HttpModule,
    LogsModule,
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      ComponentDeploymentsRepository
    ])
  ],
  providers: [
    SpinnakerService,
    DeploymentConfigurationService,
    MooveService,
    DatabasesService
  ],
  exports: [
    SpinnakerService,
    DeploymentConfigurationService,
    MooveService,
    DatabasesService
  ]
})
export class IntegrationsModule {}
