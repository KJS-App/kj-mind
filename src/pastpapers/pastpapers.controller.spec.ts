import { Test, TestingModule } from '@nestjs/testing';
import { PastpapersController } from './pastpapers.controller';
import { PastpapersService } from './pastpapers.service';

describe('PastpapersController', () => {
  let controller: PastpapersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PastpapersController],
      providers: [PastpapersService],
    }).compile();

    controller = module.get<PastpapersController>(PastpapersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
