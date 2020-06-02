/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    ComponentUndeploymentsRepository,
    QueuedIstioDeploymentsRepository
} from '../../api/deployments/repository'
import { ModuleDeploymentsRepository } from '../../api/deployments/repository/module-deployments.repository'
import { DeploymentsRepository } from '../../api/deployments/repository/deployments.repository'
import { ModuleUndeploymentsRepository } from '../../api/deployments/repository/module-undeployments.repository'
import { UndeploymentsRepository } from '../../api/deployments/repository/undeployments.repository'
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
            UndeploymentsRepository,
            QueuedIstioDeploymentsRepository,
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
