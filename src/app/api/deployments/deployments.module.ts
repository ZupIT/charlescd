import { Module } from '@nestjs/common';
import { DeploymentsController } from './controller/deployments.controller';
import { DeploymentsService } from './service/deployments.service';
import { IntegrationsModule } from '../../core/integrations/integrations.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [DeploymentsController],
  providers: [DeploymentsService]
})
export class DeploymentsModule {}
