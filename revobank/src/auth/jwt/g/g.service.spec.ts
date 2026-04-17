import { Test, TestingModule } from '@nestjs/testing';
import { GService } from './g.service';

describe('GService', () => {
  let service: GService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GService],
    }).compile();

    service = module.get<GService>(GService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
