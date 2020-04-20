import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { ReadCdConfigurationDto } from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CdConfigurationsRepository } from '../repository'
import { CdConfigurationEntity } from '../entity'

@Injectable()
export class GetCdConfigurationsUsecase {

    constructor(
        @InjectRepository(CdConfigurationsRepository)
        private readonly cdConfigurationsRepository: CdConfigurationsRepository
    ) {}

    public async execute(applicationId: string): Promise<ReadCdConfigurationDto[]> {

        try {
            const cdConfigurations: CdConfigurationEntity[] =
                await this.cdConfigurationsRepository.findAllByApplicationId(applicationId)
            return cdConfigurations.map(configuration => configuration.toReadDto())
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
