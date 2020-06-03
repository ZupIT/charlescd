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

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    ComponentDeploymentEntity,
    ComponentUndeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    ModuleUndeploymentEntity,
    UndeploymentEntity
} from '../../../api/deployments/entity'
import {
    DeploymentStatusEnum,
    UndeploymentStatusEnum,
    QueuedPipelineStatusEnum
} from '../../../api/deployments/enums'
import {
    ComponentDeploymentsRepository,
    ComponentUndeploymentsRepository,
    QueuedIstioDeploymentsRepository
} from '../../../api/deployments/repository'
import { UndeploymentsRepository } from '../../../api/deployments/repository/undeployments.repository'
import { ModuleUndeploymentsRepository } from '../../../api/deployments/repository/module-undeployments.repository'
import { DeploymentsRepository } from '../../../api/deployments/repository/deployments.repository'
import { ModuleDeploymentsRepository } from '../../../api/deployments/repository/module-deployments.repository'
import { ConsoleLoggerService } from '../../logs/console'

@Injectable()
export class StatusManagementService {

    constructor(
        @InjectRepository(DeploymentsRepository)
        private readonly deploymentsRepository: DeploymentsRepository,
        @InjectRepository(ModuleDeploymentsRepository)
        private readonly moduleDeploymentRepository: ModuleDeploymentsRepository,
        @InjectRepository(ComponentDeploymentsRepository)
        private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
        @InjectRepository(ComponentUndeploymentsRepository)
        private readonly componentUndeploymentsRepository: ComponentUndeploymentsRepository,
        @InjectRepository(ModuleUndeploymentsRepository)
        private readonly moduleUndeploymentsRepository: ModuleUndeploymentsRepository,
        @InjectRepository(QueuedIstioDeploymentsRepository)
        private readonly queuedIstioDeploymentsRepository: QueuedIstioDeploymentsRepository,
        @InjectRepository(UndeploymentsRepository)
        private readonly undeploymentsRepository: UndeploymentsRepository,
        private readonly consoleLoggerService: ConsoleLoggerService
    ) {}

    public async deepUpdateUndeploymentStatus(undeployment: UndeploymentEntity, status: UndeploymentStatusEnum) : Promise<void[][]>{
        await this.undeploymentsRepository.updateStatus(undeployment.id, status)
        if (!undeployment.moduleUndeployments) {
            undeployment.moduleUndeployments =
                await this.moduleUndeploymentsRepository.find({
                    where: { undeployment: { id: undeployment.id } },
                    relations: ['componentUndeployments']
                })
        }
        return Promise.all(undeployment.moduleUndeployments.map(m => this.deepUpdateModuleUndeploymentStatus(m, status)))
    }

    public async deepUpdateModuleUndeploymentStatus(moduleUndeployment: ModuleUndeploymentEntity, status: UndeploymentStatusEnum) : Promise<void[]>{
        await this.moduleUndeploymentsRepository.updateStatus(moduleUndeployment.id, status)
        return Promise.all(
            moduleUndeployment.componentUndeployments
                .map(component => this.componentUndeploymentsRepository.updateStatus(component.id, status))
        )
    }

    public async deepUpdateDeploymentStatus(deployment: DeploymentEntity, status: DeploymentStatusEnum) : Promise<void[][]>{
        await this.deploymentsRepository.updateStatus(deployment.id, status)
        if (!deployment.modules) {
            deployment.modules =
                await this.moduleDeploymentRepository.find({
                    where: { deployment: {id: deployment.id} }
                })
        }
        return Promise.all(deployment.modules.map(m => this.deepUpdateModuleStatus(m, status)))
    }

    public async deepUpdateModuleStatus(module: ModuleDeploymentEntity, status: DeploymentStatusEnum) : Promise<void[]> {
        await this.moduleDeploymentRepository.updateStatus(module.id, status)
        return Promise.all(
            module.components.map(component => this.componentDeploymentsRepository.updateStatus(component.id, status))
        )
    }

    public async setComponentDeploymentStatusAsFailed(componentDeploymentId: string): Promise<void> {

        const componentDeploymentEntity: ComponentDeploymentEntity =
            await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)

        await this.updateComponentDeploymentStatus(componentDeploymentId, DeploymentStatusEnum.FAILED)
        await this.propagateFailedStatusChange(componentDeploymentEntity)
    }

    public async setComponentDeploymentStatusAsFinished(
        componentDeploymentId: string
    ): Promise<void> {
        this.consoleLoggerService.log('START:SET_COMPONENT_DEPLOYMENT_STATUS_FINISHED', { componentDeploymentId })
        const componentDeploymentEntity: ComponentDeploymentEntity =
            await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)

        await this.updateComponentDeploymentStatus(componentDeploymentId, DeploymentStatusEnum.SUCCEEDED)
        await this.propagateSuccessStatusChange(componentDeploymentEntity)
        this.consoleLoggerService.log('FINISH:SET_COMPONENT_DEPLOYMENT_STATUS_FINISHED', componentDeploymentEntity)
    }

    public async setComponentUndeploymentStatusAsFailed(componentUndeploymentId: string): Promise<void> {
        this.consoleLoggerService.log('START:SET_COMPONENT_UNDEPLOYMENT_STATUS_FAILED', { componentUndeploymentId })
        const componentUndeployment: ComponentUndeploymentEntity =
            await this.componentUndeploymentsRepository.getOneWithRelations(componentUndeploymentId)

        await this.updateComponentUndeploymentStatus(componentUndeploymentId, UndeploymentStatusEnum.FAILED)
        await this.propagateFailedUndeploymentStatusChange(componentUndeployment)
        this.consoleLoggerService.log('FINISH:SET_COMPONENT_UNDEPLOYMENT_STATUS_FAILED', componentUndeployment)
    }

    public async hasAllFinishedModules(deploymentId: string): Promise<boolean> {
        const deployment: DeploymentEntity =
            await this.getDeploymentEntity(deploymentId)
        const finishedModules: ModuleDeploymentEntity[] =
            this.getDeploymentFinishedModules(deployment)

        return finishedModules.length === deployment.modules.length
    }

    private async propagateFailedUndeploymentStatus(
        undeployment: UndeploymentEntity
    ): Promise<void> {

        await this.updateUndeploymentStatus(undeployment.id, UndeploymentStatusEnum.FAILED)
    }

    private async propagateFailedModuleUndeploymentStatus(
        moduleUndeployment: ModuleUndeploymentEntity
    ): Promise<void> {

        await this.updateModuleUndeploymentStatus(moduleUndeployment.id, UndeploymentStatusEnum.FAILED)
    }

    private async propagateFailedUndeploymentStatusChange(
        componentUndeployment: ComponentUndeploymentEntity
    ): Promise<void> {

        await this.propagateFailedModuleUndeploymentStatus(componentUndeployment.moduleUndeployment)
        await this.propagateFailedUndeploymentStatus(componentUndeployment.moduleUndeployment.undeployment)
    }

    public async setComponentUndeploymentStatusAsFinished(
        componentUndeploymentId: string
    ): Promise<void> {
        this.consoleLoggerService.log('START:SET_COMPONENT_DEPLOYMENT_STATUS_FINISHED', { componentUndeploymentId })
        const componentUndeploymentEntity: ComponentUndeploymentEntity =
            await this.componentUndeploymentsRepository.getOneWithRelations(componentUndeploymentId)

        await this.updateComponentUndeploymentStatus(componentUndeploymentId, UndeploymentStatusEnum.SUCCEEDED)
        await this.propagateUndeploymentSuccessStatusChange(componentUndeploymentEntity)
        this.consoleLoggerService.log('FINISH:SET_COMPONENT_DEPLOYMENT_STATUS_FINISHED', componentUndeploymentEntity)
    }

    private async updateComponentUndeploymentStatus(
        componentUndeploymentId: string,
        status: UndeploymentStatusEnum
    ): Promise<void> {

        await this.componentUndeploymentsRepository.updateStatus(componentUndeploymentId, status)

    }

    private async propagateUndeploymentSuccessStatusChange(
        componentUndeployment: ComponentUndeploymentEntity
    ): Promise<void> {

        await this.propagateModuleUndeploymentSuccess(
            componentUndeployment.moduleUndeployment.id
        )
        await this.propagateUndeploymentSuccess(
            componentUndeployment.moduleUndeployment.undeployment.id
        )
    }

    private async propagateModuleUndeploymentSuccess(
        moduleUndeploymentId: string
    ): Promise<void> {

        const moduleUndeployment: ModuleUndeploymentEntity =
            await this.getModuleUndeploymentEntity(moduleUndeploymentId)
        const finishedComponents: ComponentUndeploymentEntity[] =
            this.getModuleUndeploymentFinishedComponents(moduleUndeployment)

        if (finishedComponents.length === moduleUndeployment.componentUndeployments.length) {
            await this.updateModuleUndeploymentStatus(moduleUndeploymentId, UndeploymentStatusEnum.SUCCEEDED)
        }
    }

    private async getModuleUndeploymentEntity(
        moduleUndeploymentId: string
    ): Promise<ModuleUndeploymentEntity> {

        return await this.moduleUndeploymentsRepository.findOneOrFail({
            where: { id: moduleUndeploymentId },
            relations: [
                'componentUndeployments'
            ]
        })
    }

    private getModuleUndeploymentFinishedComponents(
        moduleUndeployment: ModuleUndeploymentEntity
    ): ComponentUndeploymentEntity[] {

        return moduleUndeployment.componentUndeployments.filter(
            componentUndeployment => componentUndeployment.status === UndeploymentStatusEnum.SUCCEEDED
        )
    }

    private async updateModuleUndeploymentStatus(
        moduleUndeploymentId: string,
        status: UndeploymentStatusEnum
    ): Promise<void> {

        await this.moduleUndeploymentsRepository.updateStatus(moduleUndeploymentId, status)
    }

    private async propagateUndeploymentSuccess(
        undeploymentId: string
    ): Promise<void> {

        const undeployment: UndeploymentEntity =
            await this.getUndeploymentEntity(undeploymentId)
        const finishedModules: ModuleUndeploymentEntity[] =
            this.getUndeploymentFinishedModules(undeployment)

        if (finishedModules.length === undeployment.moduleUndeployments.length) {
            await this.updateUndeploymentStatus(undeployment.id, UndeploymentStatusEnum.SUCCEEDED)
        }
    }

    private async getUndeploymentEntity(
        undeploymentId: string
    ): Promise<UndeploymentEntity> {

        return await this.undeploymentsRepository.findOneOrFail({
            where: { id: undeploymentId },
            relations: [
                'moduleUndeployments'
            ]
        })
    }

    private getUndeploymentFinishedModules(
        undeployment: UndeploymentEntity
    ): ModuleUndeploymentEntity[] {

        return undeployment.moduleUndeployments.filter(
            moduleUndeployment => moduleUndeployment.status === UndeploymentStatusEnum.SUCCEEDED
        )
    }

    private async updateUndeploymentStatus(
        undeploymentId: string,
        status: UndeploymentStatusEnum
    ): Promise<void> {

        await this.undeploymentsRepository.updateStatus(undeploymentId, status)
    }
    private getDeploymentFinishedModules(

        deployment: DeploymentEntity
    ): ModuleDeploymentEntity[] {

        return deployment.modules.filter(
            moduleDeployment => moduleDeployment.status === DeploymentStatusEnum.SUCCEEDED
        )
    }

    private getModuleFinishedComponents(
        moduleDeployment: ModuleDeploymentEntity
    ): ComponentDeploymentEntity[] {

        return moduleDeployment.components.filter(
            componentDeployment => componentDeployment.status === DeploymentStatusEnum.SUCCEEDED
        )
    }

    private async updateDeploymentStatus(
        deploymentId: string,
        status: DeploymentStatusEnum
    ): Promise<void> {

        await this.deploymentsRepository.updateStatus(deploymentId, status)
    }

    private async getDeploymentEntity(
        deploymentId: string
    ): Promise<DeploymentEntity> {

        return await this.deploymentsRepository.findOneOrFail({
            where: { id: deploymentId },
            relations: [
                'modules'
            ]
        })
    }

    private async propagateSuccessStatusChangeToDeployment(
        deploymentId: string
    ): Promise<void> {

        const deployment: DeploymentEntity =
            await this.getDeploymentEntity(deploymentId)
        const finishedModules: ModuleDeploymentEntity[] =
            this.getDeploymentFinishedModules(deployment)

        if (finishedModules.length === deployment.modules.length && await this.isQueuedIstiodeploymentHasFinished(deployment.id)) {
            await this.updateDeploymentStatus(deployment.id, DeploymentStatusEnum.SUCCEEDED)
        }
    }

    private async isQueuedIstiodeploymentHasFinished(deploymentId: string): Promise<boolean> {
        const allQueuedIstioDeployments = await this.queuedIstioDeploymentsRepository.find({
            where: {deploymentId}
        })

        return allQueuedIstioDeployments.every(
            deployment => deployment.status === QueuedPipelineStatusEnum.FINISHED
        )
    }

    private async updateModuleDeploymentStatus(
        moduleDeploymentId: string,
        status: DeploymentStatusEnum
    ): Promise<void> {

        await this.moduleDeploymentRepository.updateStatus(moduleDeploymentId, status)
    }

    private async getModuleDeploymentEntity(
        moduleDeploymentId: string
    ): Promise<ModuleDeploymentEntity> {

        return await this.moduleDeploymentRepository.findOneOrFail({
            where: { id: moduleDeploymentId },
            relations: [
                'components'
            ]
        })
    }

    private async propagateSuccessStatusChangeToModule(
        moduleDeploymentId: string
    ): Promise<void> {

        const moduleDeployment: ModuleDeploymentEntity =
            await this.getModuleDeploymentEntity(moduleDeploymentId)
        const finishedComponents: ComponentDeploymentEntity[] =
            this.getModuleFinishedComponents(moduleDeployment)

        if (finishedComponents.length === moduleDeployment.components.length) {
            await this.updateModuleDeploymentStatus(moduleDeploymentId, DeploymentStatusEnum.SUCCEEDED)
        }
    }

    private async propagateSuccessStatusChange(
        componentDeploymentEntity: ComponentDeploymentEntity
    ): Promise<void> {

        await this.propagateSuccessStatusChangeToModule(
            componentDeploymentEntity.moduleDeployment.id
        )
        await this.propagateSuccessStatusChangeToDeployment(
            componentDeploymentEntity.moduleDeployment.deployment.id
        )
    }

    private async updateComponentDeploymentStatus(
        componentDeploymentId: string,
        status: DeploymentStatusEnum
    ): Promise<void> {

        await this.componentDeploymentsRepository.updateStatus(componentDeploymentId, status)

    }

    private async propagageFailedStatusChangeToDeployment(
        deployment: DeploymentEntity
    ): Promise<void> {

        await this.updateDeploymentStatus(deployment.id, DeploymentStatusEnum.FAILED)
    }

    private async propagateFailedStatusChangeToModule(
        moduleDeployment: ModuleDeploymentEntity
    ): Promise<void> {

        await this.updateModuleDeploymentStatus(moduleDeployment.id, DeploymentStatusEnum.FAILED)
    }

    private async propagateFailedStatusChange(
        componentDeploymentEntity: ComponentDeploymentEntity
    ): Promise<void> {

        await this.propagateFailedStatusChangeToModule(componentDeploymentEntity.moduleDeployment)
        await this.propagageFailedStatusChangeToDeployment(componentDeploymentEntity.moduleDeployment.deployment)
    }
}
