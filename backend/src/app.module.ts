import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { NewsModule } from './modules/news/news.module';
import { ClaudeModule } from './modules/claude/claude.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    NewsModule,
    ClaudeModule,
  ],
})
export class AppModule {}
