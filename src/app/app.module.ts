import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { ApiModule } from './api/api.module'

@Module({
  imports: [
    CoreModule,
    ApiModule
  ]
})
export class AppModule {}
