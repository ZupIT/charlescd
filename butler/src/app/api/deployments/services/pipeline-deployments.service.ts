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

import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IoCTokensConstants } from '../../../core/constants/ioc'
import { CdStrategyFactory } from '../../../core/integrations/cd'
import { IConnectorConfiguration } from '../../../core/integrations/cd/interfaces'
import IEnvConfiguration from '../../../core/integrations/configuration/interfaces/env-configuration.interface'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentEntity } from '../../components/entity'
import { CdConfigurationEntity } from '../../configurations/entity'
import { CdConfigurationsRepository } from '../../configurations/repository'
import {
  CircleDeploymentEntity, ComponentDeploymentEntity, ComponentUndeploymentEntity,
  DeploymentEntity, QueuedDeploymentEntity, QueuedUndeploymentEntity, UndeploymentEntity, QueuedIstioDeploymentEntity
} from '../entity'
import { ComponentUndeploymentsRepository } from '../repository'
import { PipelineErrorHandlerService } from './pipeline-error-handler.service'

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
    queuedDeployment: QueuedDeploymentEntity,
    circle: CircleDeploymentEntity
  ): Promise<void> {

    try {
      this.consoleLoggerService.log('START:TRIGGER_CIRCLE_DEPLOYMENT', queuedDeployment)
      await this.setComponentPipelineCircle(componentDeployment, circle, component)
      const pipelineCallbackUrl: string = this.getDeploymentCallbackUrl(queuedDeployment.id)
      await this.triggerComponentDeployment(component, deployment, componentDeployment, pipelineCallbackUrl)
      this.consoleLoggerService.log('FINISH:TRIGGER_CIRCLE_DEPLOYMENT', queuedDeployment)
    } catch (error) {
      this.consoleLoggerService.error('ERROR:TRIGGER_CIRCLE_DEPLOYMENT', error)
      await this.pipelineErrorHandlerService.handleComponentDeploymentFailure(componentDeployment, queuedDeployment, circle)
      await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
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
      await this.pipelineErrorHandlerService.handleComponentDeploymentFailure(componentDeployment, queuedDeployment)
      await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
      throw error
    }
  }

  public async triggerUndeployment(
    componentDeployment: ComponentDeploymentEntity,
    undeployment: UndeploymentEntity,
    component: ComponentEntity,
    queuedUndeployment: QueuedUndeploymentEntity,
    circle: CircleDeploymentEntity,
  ): Promise<void> {

    try {
      this.consoleLoggerService.log('START:TRIGGER_UNDEPLOYMENT', queuedUndeployment)
      await this.unsetComponentPipelineCircle(circle, component)
      const pipelineCallbackUrl: string = this.getUndeploymentCallbackUrl(queuedUndeployment.id)
      await this.triggerComponentUnDeployment(component, undeployment, componentDeployment, pipelineCallbackUrl)
      this.consoleLoggerService.log('FINISH:TRIGGER_UNDEPLOYMENT', queuedUndeployment)
    } catch (error) {
      this.consoleLoggerService.error('ERROR:TRIGGER_UNDEPLOYMENT', error)
      const componentUndeployment: ComponentUndeploymentEntity =
                await this.componentUndeploymentsRepository.getOneWithAllRelations(queuedUndeployment.componentUndeploymentId)
      await this.pipelineErrorHandlerService.handleComponentUndeploymentFailure(componentUndeployment, queuedUndeployment)
      await this.pipelineErrorHandlerService.handleUndeploymentFailure(componentUndeployment.moduleUndeployment.undeployment)
      throw error
    }
  }

  public async triggerIstioDefaultDeployment(
    componentDeployment: ComponentDeploymentEntity,
    component: ComponentEntity,
    deployment: DeploymentEntity,
    queuedIstioDeployment: QueuedIstioDeploymentEntity,
  ): Promise<void> {
    try {
      this.consoleLoggerService.log('START:TRIGGER_ISTIO_DEFAULT_DEPLOYMENT', queuedIstioDeployment)
      await this.setComponentPipelineDefaultCircle(componentDeployment, component)
      const pipelineCallbackUrl: string = this.getIstioDeploymentCallbackUrl(queuedIstioDeployment.id)
      await this.triggerIstioComponentDeployment(component, deployment, componentDeployment, pipelineCallbackUrl)
      this.consoleLoggerService.log('FINISH:TRIGGER_ISTIO_DEFAULT_DEPLOYMENT', queuedIstioDeployment)
    } catch (error) {
      this.consoleLoggerService.error('ERROR:TRIGGER_ISTIO_DEFAULT_DEPLOYMENT', error)
      throw error
    }
  }

  public async triggerIstioDeployment(
    componentDeployment: ComponentDeploymentEntity,
    component: ComponentEntity,
    deployment: DeploymentEntity,
    queuedIstioDeployment: QueuedIstioDeploymentEntity,
    circle: CircleDeploymentEntity
  ): Promise<void> {
    try {
      this.consoleLoggerService.log('START:TRIGGER_ISTIO_DEPLOYMENT', queuedIstioDeployment)
      await this.setComponentPipelineCircle(componentDeployment, circle, component)
      const pipelineCallbackUrl: string = this.getIstioDeploymentCallbackUrl(queuedIstioDeployment.id)
      await this.triggerIstioComponentDeployment(component, deployment, componentDeployment, pipelineCallbackUrl)
      this.consoleLoggerService.log('FINISH:TRIGGER_ISTIO_DEPLOYMENT', queuedIstioDeployment)
    } catch (error) {
      this.consoleLoggerService.error('ERROR:TRIGGER_ISTIO_DEPLOYMENT', error)
      throw error
    }
  }

  private async setComponentPipelineCircle(
    componentDeployment: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    component: ComponentEntity,
  ): Promise<void> {
    try {
      component.setPipelineCircle(circle, componentDeployment)
      await this.componentsRepository.save(component)
    } catch (error) {
      this.consoleLoggerService.error('ERROR:COULD_NOT_UPDATE_COMPONENT_PIPELINE', error)
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
      this.consoleLoggerService.error('ERROR:COULD_NOT_UPDATE_COMPONENT_PIPELINE', error)
      throw new InternalServerErrorException('Could not update component pipeline')
    }
  }

  private async unsetComponentPipelineCircle(
    circle: CircleDeploymentEntity,
    component: ComponentEntity
  ): Promise<void> {
    try {
      component.unsetPipelineCircle(circle)
      await this.componentsRepository.save(component)
    } catch (error) {
      this.consoleLoggerService.error('ERROR:COULD_NOT_UPDATE_COMPONENT_PIPELINE', error)
      throw new InternalServerErrorException('Could not update component pipeline')
    }
  }

  private getDeploymentCallbackUrl(queuedDeploymentId: number): string {
    return `${this.envConfiguration.darwinDeploymentCallbackUrl}?queuedDeploymentId=${queuedDeploymentId}`
  }

  private getUndeploymentCallbackUrl(queuedUndeploymentId: number): string {
    return `${this.envConfiguration.darwinUndeploymentCallbackUrl}?queuedUndeploymentId=${queuedUndeploymentId}`
  }

  private getIstioDeploymentCallbackUrl(queuedIstioDeploymentId: number): string {
    return `${this.envConfiguration.darwinIstioDeploymentCallbackUrl}?queuedIstioDeploymentId=${queuedIstioDeploymentId}`
  }

  private async triggerComponentDeployment(
    componentEntity: ComponentEntity,
    deploymentEntity: DeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    pipelineCallbackUrl: string
  ): Promise<void> {

    if (!deploymentEntity.cdConfigurationId) {
      throw new NotFoundException('Deployment does not have cd configuration id')
    }
    this.consoleLoggerService.log('START:INSTANTIATE_CD_SERVICE')
    const cdConfiguration =
            await this.cdConfigurationsRepository.findDecrypted(deploymentEntity.cdConfigurationId)

    if (!cdConfiguration) {
      throw new NotFoundException(`Configuration not found - id: ${deploymentEntity.cdConfigurationId}`)
    }
    const cdService = this.cdStrategyFactory.create(cdConfiguration.type)

    this.consoleLoggerService.log('FINISH:INSTANTIATE_CD_SERVICE', cdConfiguration)
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
    if (!undeploymentEntity.deployment.cdConfigurationId) {
      throw new NotFoundException('Deployment does not have cd configuration id')
    }
    this.consoleLoggerService.log('START:INSTANTIATE_CD_SERVICE')
    const cdConfiguration =
            await this.cdConfigurationsRepository.findDecrypted(undeploymentEntity.deployment.cdConfigurationId)

    const cdService = this.cdStrategyFactory.create(cdConfiguration.type)

    this.consoleLoggerService.log('FINISH:INSTANTIATE_CD_SERVICE', cdConfiguration)
    const connectorConfiguration: IConnectorConfiguration = this.getConnectorConfiguration(
      componentEntity, cdConfiguration, componentDeployment,
      undeploymentEntity.circleId, pipelineCallbackUrl
    )
    await cdService.createUndeployment(connectorConfiguration)
  }

  private async triggerIstioComponentDeployment(
    componentEntity: ComponentEntity,
    deploymentEntity: DeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    pipelineCallbackUrl: string
  ): Promise<void> {
    if (!deploymentEntity.cdConfigurationId) {
      throw new NotFoundException('Deployment does not have cd configuration id')
    }
    const cdConfiguration =
            await this.cdConfigurationsRepository.findDecrypted(deploymentEntity.cdConfigurationId)

    if (!cdConfiguration) {
      throw new NotFoundException(`Configuration not found - id: ${deploymentEntity.cdConfigurationId}`)
    }
    const cdService = this.cdStrategyFactory.create(cdConfiguration.type)

    const connectorConfiguration: IConnectorConfiguration = this.getConnectorConfiguration(
      componentEntity, cdConfiguration, componentDeployment,
      deploymentEntity.circleId, pipelineCallbackUrl
    )

    await cdService.createIstioDeployment(connectorConfiguration)
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
