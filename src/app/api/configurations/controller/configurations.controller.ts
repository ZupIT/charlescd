import {
    Body,
    Controller,
    Get,
    Headers,
    Post
} from '@nestjs/common'
import {
    CreateCdConfigurationDto,
    ReadCdConfigurationDto
} from '../dto'
import {
    CreateCdConfigurationUsecase,
    GetCdConfigurationsUsecase
} from '../use-cases'

@Controller('configurations')
export class ConfigurationsController {

    constructor(
        private readonly createCdConfigurationUseCase: CreateCdConfigurationUsecase,
        private readonly getCdConfigurationsUseCase: GetCdConfigurationsUsecase
    ) {}

    @Post('cd')
    public async createCdConfiguration(
        @Body() createCdConfigurationDto: CreateCdConfigurationDto,
        @Headers('x-application-id') applicationId: string
    ): Promise<ReadCdConfigurationDto> {

        return await this.createCdConfigurationUseCase.execute(createCdConfigurationDto, applicationId)
    }

    @Get('cd')
    public async getCdConfigurations(
        @Headers('x-application-id') applicationId: string
    ): Promise<ReadCdConfigurationDto[]> {

        return await this.getCdConfigurationsUseCase.execute(applicationId)
    }
}
