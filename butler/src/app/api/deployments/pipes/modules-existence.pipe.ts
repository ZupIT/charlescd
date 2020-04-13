import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import { CreateDeploymentRequestDto } from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ModuleEntity } from '../../modules/entity'

@Injectable()
export class ModulesExistencePipe implements PipeTransform {

    constructor(
        @InjectRepository(ModuleEntity)
        private readonly moduleEntityRepository: Repository<ModuleEntity>
    ) {}

    public async transform(deploymentRequest: CreateDeploymentRequestDto, metadata: ArgumentMetadata): Promise<CreateDeploymentRequestDto> {

        const modules: ModuleEntity[] = await Promise.all(
            deploymentRequest.modules.map(
                moduleDeployment => this.moduleEntityRepository.findOne({ id: moduleDeployment.moduleId })
            )
        )

        if (modules.filter(module => !module).length) {
            throw new BadRequestException('Module does not exist')
        }

        return deploymentRequest
    }
}
