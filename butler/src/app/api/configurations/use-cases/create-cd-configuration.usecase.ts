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
import * as stackTrace from 'stack-trace'
import { ConsoleLoggerService } from '../../../core/logs/console'


@Injectable()
export class CreateCdConfigurationUsecase {

    constructor(
        @InjectRepository(CdConfigurationsRepository)
        private readonly cdConfigurationsRepository: CdConfigurationsRepository,
        private readonly consoleLoggerService: ConsoleLoggerService
    ) {}

    public async execute(
        createCdConfigurationDto: CreateCdConfigurationDto,
        applicationId: string
    ): Promise<ReadCdConfigurationDto> {

        try {
            this.consoleLoggerService.log('START:CREATE_CONFIGURATION', createCdConfigurationDto)
            const cdConfiguration: CdConfigurationEntity =
                await this.cdConfigurationsRepository.saveEncrypted(createCdConfigurationDto.toEntity(applicationId))
            this.consoleLoggerService.log('FINISH:CREATE_CONFIGURATION', cdConfiguration.toReadDto())
            return cdConfiguration.toReadDto()
        } catch (error) {
            this.consoleLoggerService.error('ERROR:CREATE_CONFIGURATION: ', error)
            throw new InternalServerErrorException(error)
        }
    }
}
