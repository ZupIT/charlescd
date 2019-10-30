import { Module } from '@nestjs/common'
import {StatusManagementService} from './deployments'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity} from '../../api/deployments/entity'
import {ComponentDeploymentsRepository} from '../../api/deployments/repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ComponentDeploymentEntity,
            ComponentDeploymentsRepository,
            DeploymentEntity,
            ModuleDeploymentEntity
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
