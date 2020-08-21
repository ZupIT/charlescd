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

import { InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateResult } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { QueuedDeploymentsConstraints } from '../../../../v1/core/integrations/databases/constraints'
import { MooveService } from '../../../../v1/core/integrations/moove'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { DateUtils } from '../../../core/utils/date.utils'
import { DeploymentNotificationRequestDto } from '../dto/deployment-notification-request.dto'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { ExecutionTypeEnum } from '../enums'
import { DeploymentRepositoryV2 } from '../repository/deployment.repository'
import { NotificationStatusEnum } from '../../../../v1/api/notifications/enums'

export class ReceiveNotificationUseCase {

  constructor(
    @InjectRepository(DeploymentRepositoryV2)
    private deploymentRepository: DeploymentRepositoryV2,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private mooveService: MooveService
  ) {}

  public async execute(
    deploymentId: string,
    deploymentNotificationDto: DeploymentNotificationRequestDto,
    incomingCircleId: string | null
  ): Promise<DeploymentEntity>{

    switch (deploymentNotificationDto.type) {
      case ExecutionTypeEnum.DEPLOYMENT:
        return await this.handleDeploymentNotification(deploymentId, deploymentNotificationDto, incomingCircleId)
      case ExecutionTypeEnum.UNDEPLOYMENT:
        return await this.handleUndeploymentNotification(deploymentId, deploymentNotificationDto, incomingCircleId)
      default:
        throw new Error('Invalid Execution Type')
    }
  }

  private async handleDeploymentNotification(
    deploymentId: string,
    deploymentNotificationDto: DeploymentNotificationRequestDto,
    incomingCircleId: string | null
  ): Promise<DeploymentEntity> {

    const deployment = await this.deploymentRepository.findOneOrFail(deploymentId, { relations: ['components'] })
    const currentActiveDeployment = await this.deploymentRepository.findOne({ where: { circleId: deployment.circleId, active: true } })

    deployment.finishedAt = DateUtils.now()
    deployment.components = deployment.components.map(c => {
      c.running = false
      return c
    })

    if (deploymentNotificationDto.status === DeploymentStatusEnum.SUCCEEDED) {
      deployment.status = DeploymentStatusEnum.SUCCEEDED
      deployment.active = true
      if (currentActiveDeployment) {
        currentActiveDeployment.active = false
      }
    }

    if (deploymentNotificationDto.status === DeploymentStatusEnum.FAILED) {
      deployment.status = DeploymentStatusEnum.FAILED
      deployment.active = false
    }

    try {
      if (currentActiveDeployment) {
        await this.deploymentRepository.save(currentActiveDeployment)
      }
      const savedDeployment = await this.deploymentRepository.save(deployment)
      await this.notifyMooveAndUpdateDeployment(savedDeployment, incomingCircleId)
      return await this.deploymentRepository.findOneOrFail(savedDeployment.id, { relations: ['components'] })
    }
    catch (error) {
      if (error.constraint === QueuedDeploymentsConstraints.ONLY_ONE_ACTIVE_PER_CIRCLE_AND_CONFIG) {
        this.consoleLoggerService.log('ERROR:Can only have one deployment active per circle')
        throw new InternalServerErrorException('Can only have one deployment active per circle')
      } else {
        this.consoleLoggerService.log('ERROR:Failed to save deployment ')
        throw new InternalServerErrorException
      }
    }
  }

  private async notifyMooveAndUpdateDeployment(
    deployment: DeploymentEntity,
    incomingCircleId: string | null
  ): Promise<UpdateResult> {

    const notificationStatus = deployment.status === DeploymentStatusEnum.SUCCEEDED ?
      NotificationStatusEnum.SUCCEEDED :
      NotificationStatusEnum.FAILED

    const notificationResult = await this.sendMooveNotification(deployment.id, notificationStatus, deployment.callbackUrl, incomingCircleId)
    return await this.deploymentRepository.updateDeployment(deployment.id, notificationResult.status)
  }

  private async sendMooveNotification(deploymentId: string, status: string, callbackUrl: string, incomingCircleId: string | null) {
    return await this.mooveService.notifyDeploymentStatusV2(
      deploymentId,
      status,
      callbackUrl,
      incomingCircleId
    )
  }

  private async handleUndeploymentNotification(
    deploymentId: string,
    deploymentNotificationDto: DeploymentNotificationRequestDto,
    incomingCircleId: string | null
  ): Promise<DeploymentEntity> {

    const deployment = await this.deploymentRepository.findOneOrFail(deploymentId, { relations: ['components'] })
    deployment.components = deployment.components.map(c => {
      c.running = false
      return c
    })

    if (deploymentNotificationDto.status === DeploymentStatusEnum.SUCCEEDED) {
      deployment.active = false
    }

    try {
      const notificationStatus = deploymentNotificationDto.status === DeploymentStatusEnum.SUCCEEDED ?
        NotificationStatusEnum.UNDEPLOYED :
        NotificationStatusEnum.UNDEPLOY_FAILED

      const updatedDeployment = await this.deploymentRepository.save(deployment)
      await this.sendMooveNotification(deployment.id, notificationStatus, deployment.callbackUrl, incomingCircleId)
      return updatedDeployment
    }
    catch (error) {
      this.consoleLoggerService.log('ERROR:Failed to save deployment')
      throw new InternalServerErrorException()
    }
  }
}
