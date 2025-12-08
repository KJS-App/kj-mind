import { Test, TestingModule } from '@nestjs/testing';
import { ConversationalAgentController } from './conversational-agent.controller';
import { ConversationalAgentService } from './conversational-agent.service';

describe('ConversationalAgentController', () => {
  let controller: ConversationalAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationalAgentController],
      providers: [ConversationalAgentService],
    }).compile();

    controller = module.get<ConversationalAgentController>(ConversationalAgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
