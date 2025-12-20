import { Test, TestingModule } from '@nestjs/testing';
import { PastpapersService } from './pastpapers.service';

describe('PastpapersService', () => {
  let service: PastpapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PastpapersService],
    }).compile();

    service = module.get<PastpapersService>(PastpapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
