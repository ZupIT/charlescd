import { Test, TestingModule } from '@nestjs/testing';
import { PipelinesController } from './pipelines.controller';

describe('Pipelines Controller', () => {
  let controller: PipelinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipelinesController],
    }).compile();

    controller = module.get<PipelinesController>(PipelinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
