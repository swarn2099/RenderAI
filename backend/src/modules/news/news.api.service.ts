import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NewsAPI = require('newsapi');
import { NewsApiResponse, Article, Source } from './types/news.types';

@Injectable()
export class NewsApiService {
  private readonly newsapi: any;
  private readonly logger = new Logger(NewsApiService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('app.newsApi.apiKey');
    console.log('Loaded NEWS_API_KEY:', apiKey);
    if (!apiKey) {
      throw new Error('News API key is not configured');
    }
    this.newsapi = new NewsAPI(apiKey);
  }

  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
  }): Promise<NewsApiResponse<Article>> {
    try {
      const response = await this.newsapi.v2.topHeadlines(params);
      return response as NewsApiResponse<Article>;
    } catch (error) {
      this.logger.error(
        'Error fetching top headlines:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException('Failed to fetch top headlines');
    }
  }

  async searchEverything(params: {
    q?: string;
    sources?: string;
    domains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: string;
    pageSize?: number;
    page?: number;
  }): Promise<NewsApiResponse<Article>> {
    try {
      const response = await this.newsapi.v2.everything(params);
      return response as NewsApiResponse<Article>;
    } catch (error) {
      this.logger.error(
        'Error searching news:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException('Failed to search news articles');
    }
  }

  async getSources(params: {
    category?: string;
    language?: string;
    country?: string;
  }): Promise<NewsApiResponse<Source>> {
    try {
      const response = await this.newsapi.v2.sources(params);
      return response as NewsApiResponse<Source>;
    } catch (error) {
      this.logger.error(
        'Error fetching sources:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException('Failed to fetch news sources');
    }
  }

  async getCategoryBreakdown(): Promise<{
    status: string;
    categories: Array<{ name: string; count: number }>;
  }> {
    try {
      const categories = [
        'business',
        'technology',
        'entertainment',
        'sports',
        'health',
        'science',
      ];
      const categoryCounts: Record<string, number> = {};

      // Fetch articles for each category
      for (const category of categories) {
        const response = (await this.newsapi.v2.topHeadlines({
          country: 'us',
          category,
          pageSize: 5, // Limit to 5 articles per category to avoid rate limits
        })) as NewsApiResponse<Article>;

        if (response.articles) {
          categoryCounts[category] = response.totalResults || 0;
        }
      }

      // Add general category for articles without a specific category
      const generalResponse = (await this.newsapi.v2.topHeadlines({
        country: 'us',
        pageSize: 5,
      })) as NewsApiResponse<Article>;

      if (generalResponse.articles) {
        categoryCounts['general'] = generalResponse.totalResults || 0;
      }

      return {
        status: 'ok',
        categories: Object.entries(categoryCounts)
          .filter(([_, count]) => count > 0) // Only include categories with articles
          .map(([name, count]) => ({
            name,
            count,
          })),
      };
    } catch (error) {
      this.logger.error(
        'Error getting category breakdown:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException(
        'Failed to get category breakdown',
      );
    }
  }
}
