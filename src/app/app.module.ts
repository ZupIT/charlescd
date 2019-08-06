import { Module } from '@nestjs/common';
import { IntegrationsModule } from './core/integrations/integrations.module';

@Module({
  imports: [IntegrationsModule]
})
export class AppModule {}
