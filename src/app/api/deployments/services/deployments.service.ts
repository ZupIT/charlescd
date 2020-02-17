import { Injectable } from '@nestjs/common'
import { ReadDeploymentDto } from '../dto'
import { DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class DeploymentsService {

  constructor(
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) {}

  public async getDeployments(): Promise<ReadDeploymentDto[]> {
    return this.deploymentsRepository.find({ relations: ['modules'] })
      .then(deployments => deployments.map(deployment => deployment.toReadDto()))
  }

  public async getDeploymentById(id: string): Promise<ReadDeploymentDto> {
    return this.deploymentsRepository.findOne({ where: { id }, relations: ['modules'] })
      .then(deployment => deployment.toReadDto())
  }
}
