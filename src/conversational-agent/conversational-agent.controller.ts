import { Body, Controller, Post } from "@nestjs/common";
import { ConversationalAgentService } from "./conversational-agent.service";
import { ChatRequestDto } from "./dto/chat-request.dto";

@Controller('agent')
export class ConversationalAgentController {
  constructor(private readonly agentService: ConversationalAgentService) {}

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto) {
    const response = await this.agentService.runAgent(dto.message);
    return response;
  }
}
