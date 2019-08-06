import { Module } from '@nestjs/common';
import { PipelinesModule } from './pipelines/pipelines.module';

@Module({
  imports: [
    PipelinesModule
  ]
})
export class ApiModule {}
