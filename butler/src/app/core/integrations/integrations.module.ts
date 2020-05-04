import {
  forwardRef,
  HttpModule,
  Module
} from '@nestjs/common'
import { SpinnakerService } from './cd/spinnaker'
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
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../api/deployments/repository'
import { DatabasesService } from './databases'
import { ServicesModule } from '../services/services.module'
import { DeploymentsModule } from '../../api/deployments/deployments.module'
import { CdConfigurationsRepository } from '../../api/configurations/repository'
import { CdStrategyFactory } from './cd'
import { OctopipeService } from './cd/octopipe'
import { SpinnakerApiService } from './cd/spinnaker/spinnaker-api.service'
import { OctopipeApiService } from './cd/octopipe/octopipe-api.service'

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
      QueuedDeploymentsRepository,
      ComponentUndeploymentsRepository,
      CdConfigurationsRepository
    ])
  ],
  providers: [
    SpinnakerService,
    OctopipeService,
    MooveService,
    DatabasesService,
    CdStrategyFactory,
    SpinnakerApiService,
    OctopipeApiService
  ],
  exports: [
    MooveService,
    DatabasesService,
    CdStrategyFactory
  ]
})
export class IntegrationsModule {}
