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

import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { InternalServerErrorException } from '@nestjs/common'
import { QueuedDeploymentsConstraints } from '../../../../v1/core/integrations/databases/constraints'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { DeploymentNotificationRequestDto } from '../dto/deployment-notification-request.dto'
import { ExecutionTypeEnum } from '../enums'

export class ReceiveNotificationUseCase {

  constructor(
    @InjectRepository(DeploymentEntity)
    private deploymentRepository: Repository<DeploymentEntity>,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) {}

  public async execute(deploymentId: string, deploymentNotificationDto: DeploymentNotificationRequestDto): Promise<DeploymentEntity>{
    switch (deploymentNotificationDto.type) {
      case ExecutionTypeEnum.DEPLOYMENT:
        return await this.handleDeploymentNotification(deploymentId, deploymentNotificationDto)
      case ExecutionTypeEnum.UNDEPLOYMENT:
        return await this.handleUndeploymentNotification(deploymentId, deploymentNotificationDto)
      default:
        throw new Error('Invalid Execution Type')
    }
  }

  private async handleDeploymentNotification(deploymentId: string, deploymentNotificationDto: DeploymentNotificationRequestDto): Promise<DeploymentEntity> {
    const deployment = await this.deploymentRepository.findOneOrFail(deploymentId, { relations: ['components'] })
    const currentActiveDeployment = await this.deploymentRepository.findOne({ where: { circleId: deployment.circleId, active: true } })

    deployment.finishedAt = new Date()
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
      return await this.deploymentRepository.save(deployment)
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

  private async handleUndeploymentNotification(deploymentId: string, deploymentNotificationDto: DeploymentNotificationRequestDto): Promise<DeploymentEntity> {
    const deployment = await this.deploymentRepository.findOneOrFail(deploymentId, { relations: ['components'] })
    deployment.components = deployment.components.map(c => {
      c.running = false
      return c
    })

    if (deploymentNotificationDto.status === DeploymentStatusEnum.SUCCEEDED) {
      deployment.active = false
    }

    try {
      return await this.deploymentRepository.save(deployment)
    }
    catch (error) {
      this.consoleLoggerService.log('ERROR:Failed to save deployment')
      throw new InternalServerErrorException()
    }
  }
}
