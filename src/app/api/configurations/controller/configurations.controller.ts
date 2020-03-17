import {
    Body,
    Controller,
    Get,
    Headers,
    Post
} from '@nestjs/common'
import {
    CreateK8sConfigurationDto,
    ReadK8sConfigurationDto
} from '../dto'
import {
    CreateK8sConfigurationUsecase,
    GetK8sConfigurationsUsecase
} from '../use-cases'

@Controller('configurations')
export class ConfigurationsController {

    constructor(
        private readonly createK8sConfigurationUseCase: CreateK8sConfigurationUsecase,
        private readonly getK8sConfigurationsUseCase: GetK8sConfigurationsUsecase
    ) {}

    @Post('k8s')
    public async createK8sConfiguration(
        @Body() createK8sConfigurationDto: CreateK8sConfigurationDto,
        @Headers('x-application-id') applicationId: string
    ): Promise<ReadK8sConfigurationDto> {

        return await this.createK8sConfigurationUseCase.execute(createK8sConfigurationDto, applicationId)
    }

    @Get('k8s')
    public async getK8sConfigurations(
        @Headers('x-application-id') applicationId: string
    ): Promise<ReadK8sConfigurationDto[]> {

        return await this.getK8sConfigurationsUseCase.execute(applicationId)
    }
}
