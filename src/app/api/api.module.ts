import { Module } from '@nestjs/common'
import { DeploymentsModule } from './deployments/deployments.module'

@Module({
  imports: [DeploymentsModule]
})
export class ApiModule {}
