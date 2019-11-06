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

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ComponentDeploymentEntity,
            ComponentDeploymentsRepository,
            DeploymentEntity,
            ModuleDeploymentEntity,
            ComponentUndeploymentEntity,
            ComponentUndeploymentsRepository,
            ModuleUndeploymentEntity,
            UndeploymentEntity
        ])
    ],
    providers: [
        StatusManagementService
    ],
    exports: [
        StatusManagementService
    ]
})
export class ServicesModule {}
