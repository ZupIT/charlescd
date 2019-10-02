import { HttpModule, Module } from '@nestjs/common'
import { SpinnakerService } from './spinnaker'
import { DeploymentConfigurationService } from './configuration'
import { MooveService } from './moove'
import { ServicesModule } from '../services/services.module'
import { LogsModule } from '../logs/logs.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity } from '../../api/deployments/entity'
import { ComponentDeploymentsRepository } from '../../api/deployments/repository'

@Module({
  imports: [
    HttpModule,
    ServicesModule,
    LogsModule,
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      ComponentDeploymentsRepository
    ])
  ],
  providers: [
    SpinnakerService,
    DeploymentConfigurationService,
    MooveService
  ],
  exports: [
    SpinnakerService,
    DeploymentConfigurationService,
    MooveService
  ]
})
export class IntegrationsModule {}
