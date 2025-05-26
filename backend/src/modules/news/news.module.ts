import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsController } from './news.controller.js';
import { NewsApiService } from './news.api.service.js';

@Module({
  imports: [CacheModule.register()],
  controllers: [NewsController],
  providers: [NewsApiService],
  exports: [NewsApiService],
})
export class NewsModule {}
