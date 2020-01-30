import {
  forwardRef,
  HttpModule,
  Module
} from '@nestjs/common'
import { SpinnakerService } from './spinnaker'
import { DeploymentConfigurationService } from './configuration'
import { MooveService } from './moove'
import { LogsModule } from '../logs/logs.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../api/deployments/entity'
import {
  ComponentDeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../api/deployments/repository'
import { DatabasesService } from './databases'
import { ServicesModule } from '../services/services.module'
import { DeploymentsModule } from '../../api/deployments/deployments.module'

@Module({
  imports: [
    HttpModule,
    LogsModule,
    ServicesModule,
    forwardRef(() => DeploymentsModule),
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      ComponentDeploymentsRepository,
      DeploymentEntity,
      ModuleDeploymentEntity,
      QueuedDeploymentsRepository
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
