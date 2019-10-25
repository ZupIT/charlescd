import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from '../entity'
import { DeploymentStatusEnum } from '../enums'
import { ComponentDeploymentsRepository } from '../repository'

@Injectable()
export class StatusManagementService {

    constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>,
        @InjectRepository(ModuleDeploymentEntity)
        private readonly moduleDeploymentRepository: Repository<ModuleDeploymentEntity>,
        @InjectRepository(ComponentDeploymentsRepository)
        private readonly componentDeploymentsRepository: ComponentDeploymentsRepository
    ) {}

    public async deepUpdateDeploymentStatusByDeploymentId(deploymentId: string, status: DeploymentStatusEnum) {
      const deployment: DeploymentEntity =
          await this.deploymentsRepository.findOne({
              where: { id: deploymentId },
              relations: ['modules']
          })

      await this.deploymentsRepository.update(deployment.id, { status })
      return Promise.all(deployment.modules.map(m => this.deepUpdateModuleStatus(m, status)))
    }

    public async deepUpdateDeploymentStatus(deployment: DeploymentEntity, status: DeploymentStatusEnum) {
      await this.deploymentsRepository.update(deployment.id, { status })
      if (!deployment.modules) {
            deployment.modules =
                await this.moduleDeploymentRepository.find({
                    where: { deployment: {id: deployment.id} }
                })
        }
      return Promise.all(deployment.modules.map(m => this.deepUpdateModuleStatus(m, status)))
    }

    public async deepUpdateModuleStatus(module: ModuleDeploymentEntity, status: DeploymentStatusEnum) {
      await this.moduleDeploymentRepository.update(module.id, { status })
      return Promise.all(
          module.components.map(component =>
          this.componentDeploymentsRepository.update(component.id, { status })))
    }

    public async setComponentDeploymentStatusAsFailed(componentDeploymentId: string): Promise<void> {

      const componentDeploymentEntity: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)

      await this.updateComponentDeploymentStatus(componentDeploymentId, DeploymentStatusEnum.FAILED)
      await this.propagateFailedStatusChange(componentDeploymentEntity)
    }

    public async setComponentDeploymentStatusAsFinished(
      componentDeploymentId: string
    ): Promise<void> {

      const componentDeploymentEntity: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)

      await this.updateComponentDeploymentStatus(componentDeploymentId, DeploymentStatusEnum.FINISHED)
      await this.propagateSuccessStatusChange(componentDeploymentEntity)
    }

    private getDeploymentFinishedModules(
      deployment: DeploymentEntity
    ): ModuleDeploymentEntity[] {

      return deployment.modules.filter(
        moduleDeployment => moduleDeployment.status === DeploymentStatusEnum.FINISHED
      )
    }

    private getModuleFinishedComponents(
      moduleDeployment: ModuleDeploymentEntity
    ): ComponentDeploymentEntity[] {

      return moduleDeployment.components.filter(
        componentDeployment => componentDeployment.status === DeploymentStatusEnum.FINISHED
      )
    }

    private async updateDeploymentStatus(
      deploymentId: string,
      status: DeploymentStatusEnum
    ): Promise<void> {

      await this.deploymentsRepository.update(
        { id: deploymentId },
        { status }
      )
    }

    private async getDeploymentEntity(
      deploymentId: string
    ): Promise<DeploymentEntity> {

      return await this.deploymentsRepository.findOne({
        where: { id: deploymentId },
        relations: [
          'modules'
        ]
      })
    }

    private async propagateSuccessStatusChangeToDeployment(
      deploymentId: string
    ): Promise<void> {

      const deployment: DeploymentEntity =
        await this.getDeploymentEntity(deploymentId)
      const finishedModules: ModuleDeploymentEntity[] =
        this.getDeploymentFinishedModules(deployment)

      if (finishedModules.length === deployment.modules.length) {
        await this.updateDeploymentStatus(deployment.id, DeploymentStatusEnum.FINISHED)
      }
    }

    private async updateModuleDeploymentStatus(
      moduleDeploymentId: string,
      status: DeploymentStatusEnum
    ): Promise<void> {

      await this.moduleDeploymentRepository.update(
        { id: moduleDeploymentId },
        { status }
      )
    }

    private async getModuleDeploymentEntity(
      moduleDeploymentId: string
    ): Promise<ModuleDeploymentEntity> {

      return await this.moduleDeploymentRepository.findOne({
        where: { id: moduleDeploymentId },
        relations: [
          'components'
        ]
      })
    }

    private async propagateSuccessStatusChangeToModule(
      moduleDeploymentId: string
    ): Promise<void> {

      const moduleDeployment: ModuleDeploymentEntity =
        await this.getModuleDeploymentEntity(moduleDeploymentId)
      const finishedComponents: ComponentDeploymentEntity[] =
        this.getModuleFinishedComponents(moduleDeployment)

      if (finishedComponents.length === moduleDeployment.components.length) {
        await this.updateModuleDeploymentStatus(moduleDeploymentId, DeploymentStatusEnum.FINISHED)
      }
    }

    private async propagateSuccessStatusChange(
      componentDeploymentEntity: ComponentDeploymentEntity
    ): Promise<void> {

      await this.propagateSuccessStatusChangeToModule(
        componentDeploymentEntity.moduleDeployment.id
      )
      await this.propagateSuccessStatusChangeToDeployment(
        componentDeploymentEntity.moduleDeployment.deployment.id
      )
    }

    private async updateComponentDeploymentStatus(
      componentDeploymentId: string,
      status: DeploymentStatusEnum
    ): Promise<void> {

      await this.componentDeploymentsRepository.update(
        { id: componentDeploymentId },
        { status }
      )
    }

    private async propagageFailedStatusChangeToDeployment(
      deployment: DeploymentEntity
    ): Promise<void> {

      await this.updateDeploymentStatus(deployment.id, DeploymentStatusEnum.FAILED)
    }

    private async propagateFailedStatusChangeToModule(
      moduleDeployment: ModuleDeploymentEntity
    ): Promise<void> {

      await this.updateModuleDeploymentStatus(moduleDeployment.id, DeploymentStatusEnum.FAILED)
    }

    private async propagateFailedStatusChange(
      componentDeploymentEntity: ComponentDeploymentEntity
    ): Promise<void> {

      await this.propagateFailedStatusChangeToModule(componentDeploymentEntity.moduleDeployment)
      await this.propagageFailedStatusChangeToDeployment(componentDeploymentEntity.moduleDeployment.deployment)
    }
}
