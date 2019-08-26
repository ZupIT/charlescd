import { Module } from '@nestjs/common'
import { ModulesController } from './controller'
import { ModulesService } from './services'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentEntity, ModuleEntity } from './entity'

@Module({
  imports: [
    IntegrationsModule,
    TypeOrmModule.forFeature([
      ModuleEntity,
      ComponentEntity
    ])
  ],
  controllers: [ModulesController],
  providers: [ModulesService]
})
export class ModulesModule {}
