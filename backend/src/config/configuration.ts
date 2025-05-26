import { registerAs } from '@nestjs/config';

const configuration = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) ?? 3000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  newsApi: {
    apiKey: process.env.NEWS_API_KEY ?? '',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10) ?? 6379,
  },
  apiPrefix: process.env.API_PREFIX ?? 'api',
  apiVersion: process.env.API_VERSION ?? 'v1',
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  mcp: {
    serverUrl: process.env.MCP_SERVER_URL || 'http://localhost:3001',
  },
}));

export default configuration;
