import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type {
  Message as ClaudeMessage,
  MessageParam,
  ContentBlockParam,
  MessageCreateParams,
  MessageCreateParamsNonStreaming,
  Tool,
} from '@anthropic-ai/sdk/resources/messages';
import axios, { AxiosError } from 'axios';

interface Article {
  title: string;
  description?: string;
  source?: {
    name: string;
  };
  publishedAt: string;
}

interface TopHeadlinesResponse {
  status: string;
  articles: Article[];
}

interface InputSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
  $schema?: string;
}

interface ToolDefinition {
  name: string;
  description: string;
  input_schema: InputSchema;
}

interface McpServerResponse {
  tools: ToolDefinition[];
}

interface ToolCall {
  id: string;
  name: string;
  input: Record<string, any>;
}

interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, any>;
}

interface ToolResult {
  status: string;
  articles?: Article[];
  categories?: Array<{ name: string; count: number }>;
  visualization?: string;
}

interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | Record<string, any>;
}

@Injectable()
export class ClaudeService {
  private anthropic: Anthropic;
  private readonly logger = new Logger(ClaudeService.name);
  private readonly mcpServerUrl: string;

  constructor(private configService: ConfigService) {
    const anthropicApiKey = this.configService.get<string>(
      'app.anthropic.apiKey',
    );
    console.log('anthropicApiKey', anthropicApiKey);
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key is not configured');
    }
    this.anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    const mcpServerUrl = this.configService.get<string>('app.mcp.serverUrl');
    if (!mcpServerUrl) {
      throw new Error('MCP server URL is not configured');
    }
    this.mcpServerUrl = mcpServerUrl;
  }

  private async fetchTools(): Promise<ToolDefinition[]> {
    try {
      this.logger.debug(
        `Fetching tools from MCP server at ${this.mcpServerUrl}/tools`,
      );
      const response = await axios.get<McpServerResponse>(
        `${this.mcpServerUrl}/tools`,
      );
      this.logger.debug(
        'Received tools from MCP server:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data.tools;
    } catch (error: unknown) {
      this.logger.error('Failed to fetch tools from MCP server:', error);
      if (error instanceof AxiosError) {
        this.logger.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
      }
      return [];
    }
  }

  private async executeTool(toolCall: ToolCall): Promise<ToolResult> {
    try {
      // Execute the tool through the MCP server
      const response = await axios.post<ToolResult>(
        `${this.mcpServerUrl}/execute`,
        {
          name: toolCall.name,
          input: toolCall.input,
        },
      );

      // Return structured data for all tools
      if (toolCall.name === 'get-top-headlines') {
        const data = response.data as TopHeadlinesResponse;
        if (data.status === 'ok' && Array.isArray(data.articles)) {
          return {
            status: 'ok',
            articles: data.articles,
            visualization: 'table', // Add visualization type for table rendering
          };
        }
      }

      // For get-category-breakdown and other tools, return structured data
      return response.data;
    } catch (error) {
      this.logger.error('Failed to execute tool:', error);
      throw error;
    }
  }

  async sendPrompt(prompt: string, tools?: ToolDefinition[]) {
    // If no tools provided, fetch them from MCP server
    const toolsToUse = tools || (await this.fetchTools());
    this.logger.debug('Using tools:', JSON.stringify(toolsToUse, null, 2));

    const messages: MessageParam[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    while (true) {
      const request: MessageCreateParamsNonStreaming = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages,
        stream: false,
        ...(toolsToUse && toolsToUse.length > 0
          ? {
              tools: toolsToUse.map((tool): Tool => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { type, ...restSchema } = tool.input_schema;
                return {
                  name: tool.name,
                  description: tool.description,
                  input_schema: {
                    type: 'object' as const,
                    ...restSchema,
                  },
                };
              }),
            }
          : {}),
      };

      try {
        const response = await this.anthropic.messages.create(request);

        if ('content' in response) {
          const message = response as ClaudeMessage;
          messages.push({
            role: 'assistant',
            content: message.content.map((block) => {
              if (block.type === 'text') {
                return { type: 'text', text: block.text } as ContentBlockParam;
              }
              const { type, ...rest } = block;
              return { type, ...rest } as ContentBlockParam;
            }),
          });

          const toolUses = message.content.filter(
            (item): item is ToolUseBlock => item.type === 'tool_use',
          );

          if (toolUses.length > 0) {
            const toolResults = await Promise.all(
              toolUses.map(async (toolUse) => {
                const result = await this.executeTool({
                  id: toolUse.id,
                  name: toolUse.name,
                  input: toolUse.input,
                });

                // Add visualization metadata for visualization tools
                let visualizationType = 'pie_chart'; // default
                if (
                  toolUse.input &&
                  typeof toolUse.input.chart_type === 'string'
                ) {
                  visualizationType = toolUse.input.chart_type;
                }

                if (toolUse.name === 'get-category-breakdown') {
                  result.visualization = visualizationType;
                }

                return {
                  type: 'tool_result' as const,
                  tool_use_id: toolUse.id,
                  content: result, // pass the object directly for visualization
                } as ToolResultBlock;
              }),
            );

            // If any tool result is a visualization, return it directly to the frontend
            const visualizationResult = toolResults.find(
              (tr) =>
                tr.type === 'tool_result' &&
                tr.content.includes('visualization'),
            );
            if (visualizationResult) {
              return {
                content: [visualizationResult],
                role: 'assistant',
                type: 'message',
              };
            }

            // Only add tool results to the conversation if they are text blocks
            const textToolResults = toolResults.filter(
              (tr) => typeof tr.content === 'string',
            );
            if (textToolResults.length > 0) {
              messages.push({
                role: 'user',
                content: textToolResults.map(
                  (tr) =>
                    ({
                      type: 'text',
                      text: tr.content as string,
                    }) as ContentBlockParam,
                ),
              });
            }
          } else {
            // If no tool calls, return the final response
            return {
              content: message.content,
              role: 'assistant',
              type: 'message',
            };
          }
        } else {
          throw new Error('Unexpected response type from Claude');
        }
      } catch (error) {
        this.logger.error('Error calling Claude:', error);
        throw error;
      }
    }
  }
}
