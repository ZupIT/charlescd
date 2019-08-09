import { Module } from '@nestjs/common'
import { ModulesController } from './controller'
import { ModulesService } from './service'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ModuleEntity } from './entity'

@Module({
  imports: [
    IntegrationsModule,
    TypeOrmModule.forFeature([
      ModuleEntity
    ])
  ],
  controllers: [ModulesController],
  providers: [ModulesService]
})
export class ModulesModule {}
