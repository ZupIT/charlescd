import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import { CreateCdConfigurationDto } from '../dto'
import { CdTypeEnum } from '../enums'
import {
    validate,
    ValidationError
} from 'class-validator'

@Injectable()
export class ValidConfigurationDataPipe implements PipeTransform {

    public async transform(createCdConfigurationDto: CreateCdConfigurationDto, metadata: ArgumentMetadata): Promise<CreateCdConfigurationDto> {

        if (createCdConfigurationDto.type === CdTypeEnum.SPINNAKER) {
            const errors: ValidationError[] = await validate('spinnakerConfigurationDataSchema', createCdConfigurationDto.configurationData)
            if (errors.length) {
                throw new BadRequestException('Invalid configuration object for type SPINNAKER')
            }
        } else if (createCdConfigurationDto.type === CdTypeEnum.OCTOPIPE) {
            const errors: ValidationError[] = await validate('octopipeConfigurationDataSchema', createCdConfigurationDto.configurationData)
            if (errors.length) {
                throw new BadRequestException('Invalid configuration object for type OCTOPIPE')
            }
        } else {
            throw new BadRequestException('Invalid configuration object type')
        }

        return createCdConfigurationDto
    }
}
