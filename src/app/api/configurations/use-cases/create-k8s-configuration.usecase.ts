import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import {
    CreateK8sConfigurationDto,
    ReadK8sConfigurationDto
} from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { K8sConfigurationsRepository } from '../repository'
import { K8sConfigurationEntity } from '../entity'
import { AppConstants } from '../../../core/constants'

@Injectable()
export class CreateK8sConfigurationUsecase {

    constructor(
        @InjectRepository(K8sConfigurationsRepository)
        private readonly k8sConfigurationsRepository: K8sConfigurationsRepository
    ) {}

    public async execute(
        createK8sConfigurationDto: CreateK8sConfigurationDto
    ): Promise<ReadK8sConfigurationDto> {

        try {
            const k8sConfiguration: K8sConfigurationEntity =
                await this.k8sConfigurationsRepository.saveEncrypted(createK8sConfigurationDto.toEntity(), AppConstants.ENCRYPTION_KEY)
            return k8sConfiguration.toReadDto()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
