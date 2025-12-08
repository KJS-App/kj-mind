import { Test, TestingModule } from '@nestjs/testing';
import { ConversationalAgentService } from './conversational-agent.service';

describe('ConversationalAgentService', () => {
  let service: ConversationalAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationalAgentService],
    }).compile();

    service = module.get<ConversationalAgentService>(ConversationalAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
