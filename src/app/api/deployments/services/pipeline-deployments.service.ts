import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConsoleLoggerService } from '../../../core/logs/console'
import {
    ComponentDeploymentEntity,
    ComponentUndeploymentEntity,
    DeploymentEntity,
    QueuedDeploymentEntity,
    QueuedUndeploymentEntity,
    UndeploymentEntity
} from '../entity'
import { ComponentEntity } from '../../components/entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PipelineErrorHandlerService } from './pipeline-error-handler.service'
import { ComponentUndeploymentsRepository } from '../repository'
import IEnvConfiguration from '../../../core/integrations/configuration/interfaces/env-configuration.interface'
import { IoCTokensConstants } from '../../../core/constants/ioc'
import { CdStrategyFactory } from '../../../core/integrations/cd'
import { CdConfigurationsRepository } from '../../configurations/repository'
import { CdConfigurationEntity } from '../../configurations/entity'
import { IConnectorConfiguration } from '../../../core/integrations/cd/interfaces'

@Injectable()
export class PipelineDeploymentsService {

    constructor(
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
        private readonly cdStrategyFactory: CdStrategyFactory,
        @Inject(IoCTokensConstants.ENV_CONFIGURATION)
        private readonly envConfiguration: IEnvConfiguration,
        @InjectRepository(ComponentEntity)
        private readonly componentsRepository: Repository<ComponentEntity>,
        @InjectRepository(ComponentUndeploymentsRepository)
        private readonly componentUndeploymentsRepository: ComponentUndeploymentsRepository,
        @InjectRepository(CdConfigurationsRepository)
        private readonly cdConfigurationsRepository: CdConfigurationsRepository
    ) { }

    public async triggerCircleDeployment(
        componentDeployment: ComponentDeploymentEntity,
        component: ComponentEntity,
        deployment: DeploymentEntity,
        queuedDeployment: QueuedDeploymentEntity
    ): Promise<void> {

        try {
            this.consoleLoggerService.log('START:TRIGGER_CIRCLE_DEPLOYMENT', queuedDeployment)
            await this.setComponentPipelineCircle(componentDeployment, deployment, component)
            const pipelineCallbackUrl: string = this.getDeploymentCallbackUrl(queuedDeployment.id)
            await this.triggerComponentDeployment(component, deployment, componentDeployment, pipelineCallbackUrl)
            this.consoleLoggerService.log('FINISH:TRIGGER_CIRCLE_DEPLOYMENT', queuedDeployment)
        } catch (error) {
            this.consoleLoggerService.error('ERROR:TRIGGER_CIRCLE_DEPLOYMENT', error)
            if (deployment.circle) {
                await this.pipelineErrorHandlerService.handleComponentDeploymentFailure(componentDeployment, queuedDeployment, deployment.circle)
                await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
            }
            console.log(error)
            throw error
        }
    }

    public async triggerDefaultDeployment(
        componentDeployment: ComponentDeploymentEntity,
        component: ComponentEntity,
        deployment: DeploymentEntity,
        queuedDeployment: QueuedDeploymentEntity
    ): Promise<void> {

        try {
            this.consoleLoggerService.log('START:TRIGGER_DEFAULT_DEPLOYMENT', queuedDeployment)
            await this.setComponentPipelineDefaultCircle(componentDeployment, component)
            const pipelineCallbackUrl: string = this.getDeploymentCallbackUrl(queuedDeployment.id)
            await this.triggerComponentDeployment(component, deployment, componentDeployment, pipelineCallbackUrl)
            this.consoleLoggerService.log('FINISH:TRIGGER_DEFAULT_DEPLOYMENT', queuedDeployment)
        } catch (error) {
            this.consoleLoggerService.error('ERROR:TRIGGER_DEFAULT_DEPLOYMENT', error)
            if (deployment.circle) {
                await this.pipelineErrorHandlerService.handleComponentDeploymentFailure(componentDeployment, queuedDeployment, deployment.circle)
                await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
                throw error
            }
        }
    }

    public async triggerUndeployment(
        componentDeployment: ComponentDeploymentEntity,
        undeployment: UndeploymentEntity,
        component: ComponentEntity,
        deployment: DeploymentEntity,
        queuedUndeployment: QueuedUndeploymentEntity
    ): Promise<void> {

        try {
            this.consoleLoggerService.log('START:TRIGGER_UNDEPLOYMENT', queuedUndeployment)
            await this.unsetComponentPipelineCircle(deployment, component)
            const pipelineCallbackUrl: string = this.getUndeploymentCallbackUrl(queuedUndeployment.id)
            await this.triggerComponentUnDeployment(component, undeployment, componentDeployment, pipelineCallbackUrl)
            this.consoleLoggerService.log('FINISH:TRIGGER_UNDEPLOYMENT', queuedUndeployment)
        } catch (error) {
            this.consoleLoggerService.error('ERROR:TRIGGER_UNDEPLOYMENT', error)
            const componentUndeployment: ComponentUndeploymentEntity | undefined =
                await this.componentUndeploymentsRepository.getOneWithRelations(queuedUndeployment.componentUndeploymentId)
            await this.pipelineErrorHandlerService.handleComponentUndeploymentFailure(componentDeployment, queuedUndeployment)
            if (componentUndeployment) {
                await this.pipelineErrorHandlerService.handleUndeploymentFailure(componentUndeployment.moduleUndeployment.undeployment)
            }
            throw error
        }
    }

    private async setComponentPipelineCircle(
        componentDeployment: ComponentDeploymentEntity,
        deployment: DeploymentEntity,
        component: ComponentEntity
    ): Promise<void> {
        if (!deployment.circle) {
            throw new NotFoundException(`Deployment does not have a circle`)
        }
        try {
            component.setPipelineCircle(deployment.circle, componentDeployment)
            await this.componentsRepository.save(component)
        } catch (error) {
            throw new InternalServerErrorException('Could not update component pipeline')
        }
    }

    private async setComponentPipelineDefaultCircle(
        componentDeployment: ComponentDeploymentEntity,
        component: ComponentEntity
    ): Promise<void> {

        try {
            component.setPipelineDefaultCircle(componentDeployment)
            await this.componentsRepository.save(component)
        } catch (error) {
            throw new InternalServerErrorException('Could not update component pipeline')
        }
    }

    private async unsetComponentPipelineCircle(
        deployment: DeploymentEntity,
        component: ComponentEntity
    ): Promise<void> {
        if (!deployment.circle) {
            throw new NotFoundException(`Deployment does not have a circle`)
        }
        try {
            component.unsetPipelineCircle(deployment.circle)
            await this.componentsRepository.save(component)
        } catch (error) {
            throw new InternalServerErrorException('Could not update component pipeline')
        }
    }

    private getDeploymentCallbackUrl(queuedDeploymentId: number): string {
        return `${this.envConfiguration.darwinDeploymentCallbackUrl}?queuedDeploymentId=${queuedDeploymentId}`
    }

    private getUndeploymentCallbackUrl(queuedUndeploymentId: number): string {
        return `${this.envConfiguration.darwinUndeploymentCallbackUrl}?queuedUndeploymentId=${queuedUndeploymentId}`
    }

    private async triggerComponentDeployment(
        componentEntity: ComponentEntity,
        deploymentEntity: DeploymentEntity,
        componentDeployment: ComponentDeploymentEntity,
        pipelineCallbackUrl: string
    ): Promise<void> {

        if (!componentEntity.module.cdConfigurationId) {
            throw new NotFoundException(`Module does not have configuration id`)
        }
        const cdConfiguration =
            await this.cdConfigurationsRepository.findDecrypted(componentEntity.module.cdConfigurationId)

        if (!cdConfiguration) {
            throw new NotFoundException(`Configuration not found - id: ${componentEntity.module.cdConfigurationId}`)
        }
        const cdService = this.cdStrategyFactory.create(cdConfiguration.type)

        const connectorConfiguration: IConnectorConfiguration = this.getConnectorConfiguration(
            componentEntity, cdConfiguration, componentDeployment,
            deploymentEntity.circleId, pipelineCallbackUrl
        )

        await cdService.createDeployment(connectorConfiguration)
    }

    private async triggerComponentUnDeployment(
        componentEntity: ComponentEntity,
        undeploymentEntity: UndeploymentEntity,
        componentDeployment: ComponentDeploymentEntity,
        pipelineCallbackUrl: string
    ): Promise<void> {

        try {
            if (!componentEntity.module.cdConfigurationId) {
                throw new NotFoundException(`Module does not have configuration id`)
            }
            const cdConfiguration =
                await this.cdConfigurationsRepository.findDecrypted(componentEntity.module.cdConfigurationId)
            if (!cdConfiguration) {
                throw new NotFoundException(`Configuration not found - id: ${componentEntity.module.cdConfigurationId}`)
            }
            const cdService = this.cdStrategyFactory.create(cdConfiguration.type)

            const connectorConfiguration: IConnectorConfiguration = this.getConnectorConfiguration(
                componentEntity, cdConfiguration, componentDeployment,
                undeploymentEntity.circleId, pipelineCallbackUrl
            )

            await cdService.createDeployment(connectorConfiguration)
        } catch (error) {
            throw error
        }
    }

    private getConnectorConfiguration(
        component: ComponentEntity,
        cdConfiguration: CdConfigurationEntity,
        componentDeployment: ComponentDeploymentEntity,
        callbackCircleId: string,
        pipelineCallbackUrl: string
    ): IConnectorConfiguration {

        return {
            pipelineCirclesOptions: component.pipelineOptions,
            cdConfiguration: cdConfiguration.configurationData,
            componentId: componentDeployment.componentId,
            applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
            componentName: componentDeployment.componentName,
            helmRepository: componentDeployment.moduleDeployment.helmRepository,
            callbackCircleId,
            pipelineCallbackUrl
        }
    }
}
