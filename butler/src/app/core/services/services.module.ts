import { Module } from '@nestjs/common'
import { StatusManagementService } from './deployments'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
    ComponentDeploymentEntity,
    ComponentUndeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    ModuleUndeploymentEntity,
    UndeploymentEntity
} from '../../api/deployments/entity'
import {
    ComponentDeploymentsRepository,
    ComponentUndeploymentsRepository
} from '../../api/deployments/repository'
import { ModuleDeploymentsRepository } from '../../api/deployments/repository/module-deployments.repository';
import { DeploymentsRepository } from '../../api/deployments/repository/deployments.repository';
import { ModuleUndeploymentsRepository } from '../../api/deployments/repository/module-undeployments.repository';
import { UndeploymentsRepository } from '../../api/deployments/repository/undeployments.repository';
import { LogsModule } from '../logs/logs.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ComponentDeploymentEntity,
            ComponentDeploymentsRepository,
            DeploymentEntity,
            DeploymentsRepository,
            ModuleDeploymentEntity,
            ModuleDeploymentsRepository,
            ComponentUndeploymentEntity,
            ComponentUndeploymentsRepository,
            ModuleUndeploymentEntity,
            ModuleUndeploymentsRepository,
            UndeploymentEntity,
            UndeploymentsRepository
        ]), LogsModule
    ],
    providers: [
        StatusManagementService
    ],
    exports: [
        StatusManagementService
    ]
})
export class ServicesModule {}
