import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common'
import {ComponentDeploymentEntity} from '../../deployments/entity'
import {ComponentDeploymentsRepository} from '../../deployments/repository'
import {InjectRepository} from '@nestjs/typeorm'

@Injectable()
export class ComponentsPipe implements PipeTransform {
    constructor(
        @InjectRepository(ComponentDeploymentsRepository)
        private componentDeploymentsRepository: ComponentDeploymentsRepository) {
    }

    async transform(idComponent: any, metadata: ArgumentMetadata) {
        const componentDeploymentEntity: ComponentDeploymentEntity = await this.componentDeploymentsRepository.findOne({id: idComponent})
        if (!componentDeploymentEntity) {
            throw new BadRequestException('Component not found')
        }
        return idComponent
    }
}
