import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ModuleEntity } from '../../modules/entity'
import { CreateK8sConfigurationDto } from '../dto'

@Injectable()
export class ModuleUniquenessPipe implements PipeTransform {

    constructor(
        @InjectRepository(ModuleEntity)
        private readonly modulesRepository: Repository<ModuleEntity>
    ) {}

    public async transform(k8sConfigurationRequest: CreateK8sConfigurationDto, metadata: ArgumentMetadata): Promise<CreateK8sConfigurationDto> {
        const module: ModuleEntity =
            await this.modulesRepository.findOne({ id: k8sConfigurationRequest.moduleId })
        if (module) {
            throw new BadRequestException('Module k8s account was already configured')
        }
        return k8sConfigurationRequest
    }
}
