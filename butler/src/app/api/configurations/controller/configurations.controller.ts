import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    UsePipes
} from '@nestjs/common'
import {
    CreateCdConfigurationDto,
    ReadCdConfigurationDto
} from '../dto'
import {
    CreateCdConfigurationUsecase,
    GetCdConfigurationsUsecase
} from '../use-cases'
import { ValidConfigurationDataPipe } from '../pipes'

@Controller('configurations')
export class ConfigurationsController {

    constructor(
        private readonly createCdConfigurationUseCase: CreateCdConfigurationUsecase,
        private readonly getCdConfigurationsUseCase: GetCdConfigurationsUsecase
    ) {}

    @UsePipes(ValidConfigurationDataPipe)
    @Post('cd')
    public async createCdConfiguration(
        @Body() createCdConfigurationDto: CreateCdConfigurationDto,
        @Headers('x-workspace-id') workspaceId: string
    ): Promise<ReadCdConfigurationDto> {

        return await this.createCdConfigurationUseCase.execute(createCdConfigurationDto, workspaceId)
    }

    @Get('cd')
    public async getCdConfigurations(
        @Headers('x-workspace-id') workspaceId: string
    ): Promise<ReadCdConfigurationDto[]> {

        return await this.getCdConfigurationsUseCase.execute(workspaceId)
    }
}
