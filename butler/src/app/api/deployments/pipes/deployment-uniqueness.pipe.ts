import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import { CreateDeploymentRequestDto } from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'

@Injectable()
export class DeploymentUniquenessPipe implements PipeTransform {

    constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>
    ) {}

    public async transform(deploymentRequest: CreateDeploymentRequestDto, metadata: ArgumentMetadata): Promise<CreateDeploymentRequestDto> {
        const deployment: DeploymentEntity =
            await this.deploymentsRepository.findOne({ id: deploymentRequest.deploymentId })
        if (deployment) {
            throw new BadRequestException('Deployment already exists')
        }
        return deploymentRequest
    }
}
