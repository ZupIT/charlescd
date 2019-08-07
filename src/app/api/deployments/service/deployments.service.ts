import { Injectable } from '@nestjs/common'
import {
  CreateDeploymentDto,
  ReadDeploymentDto,
  UpdateDeploymentDto
} from '../dto'
import { Deployment } from '../entity/deployment.entity'
import { Repository } from 'typeorm'
import { DeploymentModule } from '../entity/deployment-module.entity'

@Injectable()
export class DeploymentsService {

  constructor(
    private readonly deploymentsRepository: Repository<Deployment>,
    private readonly deploymentModulesRepository: Repository<DeploymentModule>
  ) {}

  private async saveDeployment(createDeploymentDto: CreateDeploymentDto): Promise<Deployment> {
    return this.deploymentsRepository.save(createDeploymentDto.toEntity())
  }

  private getDeploymentModuleEntities(
    createDeploymentDto: CreateDeploymentDto,
    deployment: Deployment
  ): DeploymentModule[] {
    return createDeploymentDto.modules.map(module => module.toEntity(deployment))
  }

  private async saveDeploymentModules(
    createDeploymentDto: CreateDeploymentDto,
    deployment: Deployment
  ): Promise<DeploymentModule[]> {
    return this.deploymentModulesRepository.save(
      this.getDeploymentModuleEntities(createDeploymentDto, deployment)
    )
  }

  public async createDeployment(createDeploymentDto: CreateDeploymentDto): Promise<ReadDeploymentDto> {
    const deployment: Deployment = await this.saveDeployment(createDeploymentDto)
    await this.saveDeploymentModules(createDeploymentDto, deployment)
    return deployment.toReadDto()

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

  public updateDeployment(
    id: string,
    updateDeploymentDto: UpdateDeploymentDto
  ): ReadDeploymentDto {

  }

  public deleteDeployment(id: string) {

  }
}
