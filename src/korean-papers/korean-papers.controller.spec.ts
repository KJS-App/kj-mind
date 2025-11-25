import { Test, TestingModule } from '@nestjs/testing';
import { KoreanPapersController } from './korean-papers.controller';

describe('KoreanPapersController', () => {
  let controller: KoreanPapersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KoreanPapersController],
    }).compile();

    controller = module.get<KoreanPapersController>(KoreanPapersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
