import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ComponentDeploymentsRepository } from '../../deployments/repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository }  from 'typeorm'
import { ComponentEntity } from '../entity'

@Injectable()
export class ComponentsExistencePipe implements PipeTransform {
    constructor(
        @InjectRepository(ComponentDeploymentsRepository)
        private componentRepository: Repository<ComponentEntity>) {
    }

    async transform(idComponent: any, metadata: ArgumentMetadata) {
        const componentEntity: ComponentEntity = await this.componentRepository.findOne({id: idComponent})
        if (!componentEntity) {
            throw new BadRequestException('Component not found')
        }
        return idComponent
    }
}
