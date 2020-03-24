import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigurationsController } from './controller'
import {
    CreateCdConfigurationUsecase,
    GetCdConfigurationsUsecase
} from './use-cases'
import { CdConfigurationsRepository } from './repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CdConfigurationsRepository
        ])
    ],
    controllers: [
        ConfigurationsController
    ],
    providers: [
        CreateCdConfigurationUsecase,
        GetCdConfigurationsUsecase
    ]
})
export class ConfigurationsModule {}
