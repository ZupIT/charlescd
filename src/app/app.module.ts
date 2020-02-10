import { DynamicModule, Global, Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { DatabasesService } from './core/integrations/databases'
import { Configuration } from './config/configurations'
import { AppConstants } from './core/constants'
import IEnvConfiguration from './core/integrations/configuration/interfaces/env-configuration.interface'

@Global()
@Module({})
export class AppModule {

  public static async forRootAsync(): Promise<DynamicModule> {

    return AppModule.getModuleObject(Configuration)
  }

  private static getModuleObject(envConfiguration: IEnvConfiguration): DynamicModule {

    return {
      module: AppModule,
      imports: [
        CoreModule,
        ApiModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => (
            DatabasesService.getPostgresConnectionOptions(envConfiguration)
          )
        })
      ],
      providers: [{
        provide: 'ENV_CONFIGURATION',
        useValue: AppConstants.Configuration
      }],
      exports: [ 'ENV_CONFIGURATION']
    }
  }
}
