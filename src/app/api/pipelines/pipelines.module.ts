import { Module } from '@nestjs/common';
import { PipelinesController } from './controller/pipelines.controller';
import { PipelinesService } from './service/pipelines.service';
import { IntegrationsModule } from '../../core/integrations/integrations.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [PipelinesController],
  providers: [PipelinesService]
})
export class PipelinesModule {}
