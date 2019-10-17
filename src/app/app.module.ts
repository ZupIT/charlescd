import { DynamicModule, Global, Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabasesService } from './core/integrations/databases'
import { IConsulKV } from './core/integrations/consul/interfaces'
import { AppConstants } from './core/constants'
import { ConsulService } from './core/integrations/consul'

@Global()
@Module({})
export class AppModule {

  public static async forRootAsync(): Promise<DynamicModule> {

    const consulConfiguration: IConsulKV = await ConsulService.getAppConfiguration()
    return AppModule.getModuleObject(consulConfiguration)
  }

  private static getModuleObject(consulConfiguration: IConsulKV): DynamicModule {

    return {
      module: AppModule,
      imports: [
        CoreModule,
        ApiModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => (
            DatabasesService.getPostgresConnectionOptions(consulConfiguration)
          )
        })
      ],
      providers: [
        { provide: AppConstants.CONSUL_PROVIDER, useValue: consulConfiguration }
      ],
      exports: [ AppConstants.CONSUL_PROVIDER ]
    }
  }
}
