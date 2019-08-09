import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databasesConfig } from './core/databases'

@Module({
  imports: [
    CoreModule,
    ApiModule,
    TypeOrmModule.forRoot(
      databasesConfig.postgresqlOptions
    )
  ]
})
export class AppModule {}
