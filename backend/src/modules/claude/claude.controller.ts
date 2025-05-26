import { Controller, Post, Body } from '@nestjs/common';
import { ClaudeService } from './claude.service';

@Controller('claude')
export class ClaudeController {
  constructor(private readonly claudeService: ClaudeService) {}

  @Post('chat')
  async chat(
    @Body('prompt') prompt: string,
    @Body('tools') tools?: any[],
  ): Promise<any> {
    return this.claudeService.sendPrompt(prompt, tools);
  }
}
