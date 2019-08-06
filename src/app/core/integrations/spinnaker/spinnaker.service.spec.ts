import { Test, TestingModule } from '@nestjs/testing';
import { SpinnakerService } from './spinnaker.service';

describe('SpinnakerService', () => {
  let service: SpinnakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpinnakerService],
    }).compile();

    service = module.get<SpinnakerService>(SpinnakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
