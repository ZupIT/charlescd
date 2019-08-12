import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  ModuleDeploymentEntity,
  DeploymentEntity,
  ComponentDeploymentEntity
} from '../../api/deployments/entity'
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
}
