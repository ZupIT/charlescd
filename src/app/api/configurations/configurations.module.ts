import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigurationsController } from './controller'
import { CreateK8sConfigurationUsecase } from './use-cases'

@Module({
    imports: [
        TypeOrmModule.forFeature([
        ])
    ],
    controllers: [ConfigurationsController],
    providers: [
        CreateK8sConfigurationUsecase
    ]
})
export class ConfigurationsModule {}
