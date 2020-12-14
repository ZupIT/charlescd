import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeploymentEntityV2 } from '../api/deployments/entity/deployment.entity'
import { DeploymentRepositoryV2 } from '../api/deployments/repository/deployment.repository'
import { LogsModule } from '../core/logs/logs.module'
import { DeploymentsHookController } from './deployments.hook.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeploymentEntityV2,
      DeploymentRepositoryV2
    ]),
    LogsModule
  ],
  controllers: [
    DeploymentsHookController
  ],
  providers: [
  ]
})
export class OperatorModule {
}
