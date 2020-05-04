import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ComponentDeploymentsRepository } from '../../deployments/repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ComponentEntity } from '../entity'

@Injectable()
export class ComponentsExistencePipe implements PipeTransform {
    constructor(
        @InjectRepository(ComponentEntity)
        private componentRepository: Repository<ComponentEntity>) {
    }

    async transform(idComponent: string, metadata: ArgumentMetadata) {
        await this.componentRepository.findOneOrFail({ id: idComponent })
        return idComponent
    }
}
