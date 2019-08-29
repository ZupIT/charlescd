import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from '../../api/deployments/entity'
import { DeploymentStatusEnum } from '../../api/deployments/enums'

@Injectable()
export class DeploymentsStatusManagementService {

    constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>,
        @InjectRepository(ModuleDeploymentEntity)
        private readonly moduleDeploymentRepository: Repository<ModuleDeploymentEntity>,
        @InjectRepository(ComponentDeploymentEntity)
        private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>
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
      return Promise.all(deployment.modules.map(m => this.deepUpdateModuleStatus(m, status)))
    }

    public async deepUpdateModuleStatus(module: ModuleDeploymentEntity, status: DeploymentStatusEnum) {
      await this.moduleDeploymentRepository.update(module.id, { status })
      return Promise.all(
          module.components.map(c =>
          this.componentDeploymentRepository.update(c.id, { status })))
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

    private async propagageSuccessStatusChangeToDeployment(
      deployment: DeploymentEntity
    ): Promise<void> {

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

    private async propagateSuccessStatusChangeToModule(
      moduleDeployment: ModuleDeploymentEntity
    ): Promise<void> {

      const finishedComponents: ComponentDeploymentEntity[] =
        this.getModuleFinishedComponents(moduleDeployment)

      if (finishedComponents.length === moduleDeployment.components.length) {
        await this.updateModuleDeploymentStatus(moduleDeployment.id, DeploymentStatusEnum.FINISHED)
      }
    }

    private async propagateSuccessStatusChange(
      componentDeploymentEntity: ComponentDeploymentEntity
    ): Promise<void> {

      await this.propagateSuccessStatusChangeToModule(componentDeploymentEntity.moduleDeployment)
      await this.propagageSuccessStatusChangeToDeployment(componentDeploymentEntity.moduleDeployment.deployment)
    }

    private async updateComponentDeploymentStatus(
      componentDeploymentId: string,
      status: DeploymentStatusEnum
    ): Promise<void> {

      await this.componentDeploymentRepository.update(
        { id: componentDeploymentId },
        { status }
      )
    }

    public async setComponentDeploymentStatusAsFinished(componentDeploymentId: string): Promise<void> {
      const componentDeploymentEntity: ComponentDeploymentEntity =
        await this.componentDeploymentRepository.findOne({
          where: { id: componentDeploymentId },
          relations: ['moduleDeployment', 'moduleDeployment.components', 'moduleDeployment.deployment']
        })

      await this.updateComponentDeploymentStatus(componentDeploymentId, DeploymentStatusEnum.FINISHED)
      await this.propagateSuccessStatusChange(componentDeploymentEntity)
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

    public async setComponentDeploymentStatusAsFailed(componentDeploymentId: string): Promise<void> {
    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })

    await this.updateComponentDeploymentStatus(componentDeploymentId, DeploymentStatusEnum.FAILED)
    await this.propagateFailedStatusChange(componentDeploymentEntity)
  }
}
