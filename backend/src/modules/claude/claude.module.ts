import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClaudeService } from './claude.service';
import { ClaudeController } from './claude.controller';

@Module({
  imports: [ConfigModule],
  providers: [ClaudeService],
  controllers: [ClaudeController],
  exports: [ClaudeService],
})
export class ClaudeModule {}
