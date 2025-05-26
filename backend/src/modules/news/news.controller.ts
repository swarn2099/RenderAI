import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsApiService } from './news.api.service';
import {
  TopHeadlinesQueryDto,
  SearchEverythingQueryDto,
  SourcesQueryDto,
} from './dto/news-query.dto';
import { NewsApiResponse, Article, Source } from './types/news.types';

@ApiTags('news')
@Controller('news')
@UseInterceptors(CacheInterceptor)
export class NewsController {
  constructor(private readonly newsApiService: NewsApiService) {}

  @Get('top-headlines')
  @ApiOperation({ summary: 'Get top headlines' })
  async getTopHeadlines(
    @Query() query: TopHeadlinesQueryDto,
  ): Promise<NewsApiResponse<Article>> {
    console.log('getTopHeadlines', query);
    return this.newsApiService.getTopHeadlines(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search news articles' })
  async searchEverything(
    @Query() query: SearchEverythingQueryDto,
  ): Promise<NewsApiResponse<Article>> {
    console.log('searchEverything', query);
    return this.newsApiService.searchEverything(query);
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get news sources' })
  async getSources(
    @Query() query: SourcesQueryDto,
  ): Promise<NewsApiResponse<Source>> {
    console.log('getSources', query);
    return this.newsApiService.getSources(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get news category breakdown' })
  async getCategoryBreakdown(): Promise<{
    status: string;
    categories: Array<{ name: string; count: number }>;
  }> {
    console.log('getCategoryBreakdown');
    return this.newsApiService.getCategoryBreakdown();
  }
}
