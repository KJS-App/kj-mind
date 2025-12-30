import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PastpapersService } from './pastpapers.service';

const createFirestoreMock = () => {
  const docMock = {
    get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
    delete: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };

  const queryMock = {
    where: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    count: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: () => ({ count: 0 }) }),
    }),
    get: jest.fn().mockResolvedValue({ docs: [] }),
  };

  return {
    add: jest.fn().mockResolvedValue({ id: 'test-id' }),
    doc: jest.fn(() => docMock),
    where: queryMock.where,
    offset: queryMock.offset,
    limit: queryMock.limit,
    count: queryMock.count,
    get: queryMock.get,
  } as const;
};

const firebaseServiceMock = {
  getFirestore: jest.fn(() => createFirestoreMock()),
};

describe('PastpapersService', () => {
  let service: PastpapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PastpapersService,
        { provide: FirebaseService, useValue: firebaseServiceMock },
      ],
    }).compile();

    service = module.get<PastpapersService>(PastpapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
