import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigurationsController } from './controller'
import {
    CreateK8sConfigurationUsecase,
    GetK8sConfigurationsUsecase
} from './use-cases'
import { K8sConfigurationsRepository } from './repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            K8sConfigurationsRepository
        ])
    ],
    controllers: [
        ConfigurationsController
    ],
    providers: [
        CreateK8sConfigurationUsecase,
        GetK8sConfigurationsUsecase
    ]
})
export class ConfigurationsModule {}
