import { Module } from '@nestjs/common';
import { ConversationalAgentService } from './conversational-agent.service';
import { ConversationalAgentController } from './conversational-agent.controller';

@Module({
  controllers: [ConversationalAgentController],
  providers: [ConversationalAgentService],
})
export class ConversationalAgentModule {}
