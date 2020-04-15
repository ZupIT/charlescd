import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import {
    CreateComponentDeploymentDto,
    CreateDeploymentRequestDto
} from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ComponentEntity } from '../../components/entity'

@Injectable()
export class ComponentsExistencePipe implements PipeTransform {

    constructor(
        @InjectRepository(ComponentEntity)
        private readonly componentEntityRepository: Repository<ComponentEntity>
    ) { }

    public async transform(deploymentRequest: CreateDeploymentRequestDto, metadata: ArgumentMetadata): Promise<CreateDeploymentRequestDto> {

        const componentDeploymentsDto: CreateComponentDeploymentDto[] = deploymentRequest.modules.reduce(
            (accumulated, moduleDeploymentDto) => {
                if (moduleDeploymentDto.components) {
                    return [...accumulated, ...moduleDeploymentDto.components]
                }
                return accumulated
            }, [] as CreateComponentDeploymentDto[]
        )

        const components: Array<ComponentEntity | undefined> = await Promise.all(
            componentDeploymentsDto.map(
                componentDeployment => this.componentEntityRepository.findOne({ id: componentDeployment.componentId })
            )
        )

        if (components.filter(component => !component).length) {
            throw new BadRequestException('Component does not exist')
        }

        return deploymentRequest
    }
}
