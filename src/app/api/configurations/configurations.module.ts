import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigurationsController } from './controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([
        ])
    ],
    controllers: [ConfigurationsController],
    providers: []
})
export class ConfigurationsModule {}
