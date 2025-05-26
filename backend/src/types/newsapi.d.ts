declare module 'newsapi' {
  interface NewsAPIClient {
    v2: {
      topHeadlines(params: {
        country?: string;
        category?: string;
        sources?: string;
        q?: string;
        pageSize?: number;
        page?: number;
      }): Promise<any>;
      everything(params: {
        q?: string;
        sources?: string;
        domains?: string;
        from?: string;
        to?: string;
        language?: string;
        sortBy?: string;
        pageSize?: number;
        page?: number;
      }): Promise<any>;
      sources(params: {
        category?: string;
        language?: string;
        country?: string;
      }): Promise<any>;
    };
  }

  class NewsAPI {
    constructor(apiKey: string);
    v2: NewsAPIClient['v2'];
  }

  export default NewsAPI;
}
