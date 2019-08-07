import { Injectable } from '@nestjs/common'
import { CreateDeploymentDto, ReadDeploymentDto } from '../dto'
import { Deployment, DeploymentModule } from '../entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class DeploymentsService {

  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentsRepository: Repository<Deployment>,
    @InjectRepository(DeploymentModule)
    private readonly deploymentModulesRepository: Repository<DeploymentModule>
  ) {}

  public async createDeployment(createDeploymentDto: CreateDeploymentDto): Promise<ReadDeploymentDto> {
    return this.deploymentsRepository.save(createDeploymentDto.toEntity())
      .then(deployment => deployment.toReadDto())
  }

  private async convertDeploymentsToReadDto(deployments: Deployment[]): Promise<ReadDeploymentDto[]> {
    return deployments.map(deployment => deployment.toReadDto())
  }

  public async getDeployments(): Promise<ReadDeploymentDto[]> {
    return this.deploymentsRepository.find({ relations: ['modules'] })
      .then(deployments => this.convertDeploymentsToReadDto(deployments))
  }

  public async getDeploymentById(id: string): Promise<ReadDeploymentDto> {
    return this.deploymentsRepository.findOne({ id })
      .then(deployment => deployment.toReadDto())
  }
}
