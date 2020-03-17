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
        createCdConfigurationDto: CreateCdConfigurationDto,
        applicationId: string
    ): Promise<ReadCdConfigurationDto> {

        try {
            const cdConfiguration: CdConfigurationEntity =
                await this.cdConfigurationsRepository.saveEncrypted(createCdConfigurationDto.toEntity(applicationId))
            return cdConfiguration.toReadDto()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
