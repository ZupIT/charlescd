import { DynamicModule, Global, Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { DatabasesService } from './core/integrations/databases'
import configurations from './config/configurations'

@Global()
@Module({
  imports: [ConfigModule.forRoot({
    load: [configurations],
  })]
})
export class AppModule {

  public static async forRootAsync(): Promise<DynamicModule> {

    return AppModule.getModuleObject()
  }

  private static getModuleObject(): DynamicModule {

    return {
      module: AppModule,
      imports: [
        CoreModule,
        ApiModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => (
            DatabasesService.getPostgresConnectionOptions()
          )
        })
      ],
      providers: [],
      exports: [ ]
    }
  }
}
