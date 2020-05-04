import { Module } from '@nestjs/common'
import { HealthcheckController } from './controller'
import { HealthcheckService } from './services'

@Module({
  controllers: [HealthcheckController],
  providers: [HealthcheckService]
})
export class HealthcheckModule {}
