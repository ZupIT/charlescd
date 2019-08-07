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
    const a =  await this.deploymentsRepository.save(createDeploymentDto.toEntity())
    console.log(JSON.stringify(a))
    return a.toReadDto()
  }

  private convertDeploymentsToDto(deployments: Deployment[]): ReadDeploymentDto[] {
    return deployments.map(deployment => deployment.toReadDto())
  }

  public async getDeployments(): Promise<ReadDeploymentDto[]> {
    return this.deploymentsRepository.find()
      .then(deployments => this.convertDeploymentsToDto(deployments))
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
