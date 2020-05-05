import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigurationsController } from './controller'
import {
    CreateCdConfigurationUsecase,
    GetCdConfigurationsUsecase
} from './use-cases'
import { CdConfigurationsRepository } from './repository'

import { LogsModule } from '../../core/logs/logs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CdConfigurationsRepository
        ]),
        LogsModule
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
