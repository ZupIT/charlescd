import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabasesService } from './core/databases'

@Module({
  imports: [
    CoreModule,
    ApiModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => (
        await DatabasesService.getPostgresConnectionOptions()
      )
    })
  ]
})
export class AppModule {}
