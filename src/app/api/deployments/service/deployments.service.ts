import { Injectable } from '@nestjs/common'
import { CreateDeploymentDto, ReadDeploymentDto } from '../dto'
import { Deployment } from '../entity/deployment.entity'
import { Repository } from 'typeorm'
import { DeploymentModule } from '../entity/deployment-module.entity'
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
    console.log(JSON.stringify(deployments))
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

  // public updateDeployment(
  //   id: string,
  //   updateDeploymentDto: UpdateDeploymentDto
  // ): ReadDeploymentDto {
  //
  // }
  //
  // public deleteDeployment(id: string) {
  //
  // }
}
