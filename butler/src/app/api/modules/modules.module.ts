import { Module } from '@nestjs/common'
import { ModulesController } from './controller'
import { ModulesService } from './services'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ModuleEntity } from './entity'
import { CreateModuleUsecase } from './use-cases'

@Module({
  imports: [
    IntegrationsModule,
    TypeOrmModule.forFeature([
      ModuleEntity
    ])
  ],
  controllers: [
      ModulesController
  ],
  providers: [
      ModulesService,
      CreateModuleUsecase
  ]
})
export class ModulesModule {}
