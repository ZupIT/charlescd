import {
    Controller,
    Post
} from '@nestjs/common'
import { ReadK8sConfigurationDto } from '../dto'
import { CreateK8sConfigurationUsecase } from '../use-cases'

@Controller('configurations')
export class ConfigurationsController {

    constructor(
        private readonly createK8sConfigurationUseCase: CreateK8sConfigurationUsecase
    ) {}

    @Post('k8s')
    public async createK8sConfiguration(): Promise<ReadK8sConfigurationDto> {
        return await this.createK8sConfigurationUseCase.execute()
    }

}
