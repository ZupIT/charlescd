import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import { CreateDeploymentDto } from '../dto'
import { AppConstants } from '../../../core/constants'

@Injectable()
export class CreateDeploymentValidationPipe implements PipeTransform {

    public transform(createDeploymentDto: CreateDeploymentDto, metadata: ArgumentMetadata) {
        try {
            this.validateApplicationName(createDeploymentDto.valueFlowId)
            return createDeploymentDto
        } catch (error) {
            throw error
        }
    }

    public validateApplicationName(applicationName: string): void {
        if (!/^([a-zA-Z][a-zA-Z0-9-]*)$/.test(applicationName) ||
            applicationName.length + AppConstants.SPINNAKER_APPLICATION_PREFIX.length >= AppConstants.SPINNAKER_MAX_APPLICATION_LENGTH) {

            throw new BadRequestException('Invalid application name.')
        }
    }
}
