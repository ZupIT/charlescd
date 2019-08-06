import { Module } from '@nestjs/common';
import { PipelinesController } from './controller/pipelines.controller';
import { PipelinesService } from './service/pipelines.service';

@Module({
  controllers: [PipelinesController],
  providers: [PipelinesService]
})
export class PipelinesModule {}
