import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import {
    CreateCdConfigurationDto,
    ReadCdConfigurationDto
} from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CdConfigurationsRepository } from '../repository'
import { CdConfigurationEntity } from '../entity'

@Injectable()
export class CreateCdConfigurationUsecase {

    constructor(
        @InjectRepository(CdConfigurationsRepository)
        private readonly cdConfigurationsRepository: CdConfigurationsRepository
    ) {}

    public async execute(
        createK8sConfigurationDto: CreateCdConfigurationDto,
        applicationId: string
    ): Promise<ReadCdConfigurationDto> {

        try {
            const cdConfiguration: CdConfigurationEntity =
                await this.cdConfigurationsRepository.saveEncrypted(createK8sConfigurationDto.toEntity(applicationId))
            return cdConfiguration.toReadDto()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
