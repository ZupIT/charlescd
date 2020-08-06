import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { InternalServerErrorException } from '@nestjs/common'
import { QueuedDeploymentsConstraints } from '../../../../v1/core/integrations/databases/constraints'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'

export class NotificationUseCase {
  constructor(
    @InjectRepository(DeploymentEntity)
    private deploymentRepository: Repository<DeploymentEntity>,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async handleCallback(deploymentId: string, status: DeploymentStatusEnum): Promise<DeploymentEntity>{
    const deployment = await this.deploymentRepository.findOneOrFail(deploymentId, { relations: ['components'] })
    const currentActiveDeployment = await this.deploymentRepository.findOne({ where: { circleId: deployment.circleId, active: true } })

    deployment.finishedAt = new Date()
    deployment.components = deployment.components.map(c => {
      c.running = false
      return c
    })

    if (status === DeploymentStatusEnum.SUCCEEDED) {
      deployment.status = DeploymentStatusEnum.SUCCEEDED
      deployment.active = true
      if (currentActiveDeployment) {
        currentActiveDeployment.active = false
      }
    }

    if (status === DeploymentStatusEnum.FAILED) {
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
        this.consoleLoggerService.log('Can only have one deployment active per circle')
        throw new InternalServerErrorException('Can only have one deployment active per circle')
      } else {
        this.consoleLoggerService.log('Error when saving the deployment')
        throw new InternalServerErrorException
      }
    }
  }
}
