import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabasesConfig } from './core/databases'

@Module({
  imports: [
    CoreModule,
    ApiModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => (
        await DatabasesConfig.getPostgresqlConnectionOptions()
      )
    })
  ]
})
export class AppModule {}
