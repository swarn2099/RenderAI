import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";
import express from "express";
// @ts-ignore
import cors from "cors";
import { zodToJsonSchema } from "zod-to-json-schema";

// Add type for JSON Schema
interface JsonSchemaObject {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

dotenv.config();

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || "http://localhost:3000/api/v1/news";
const MCP_PORT = process.env.MCP_PORT || 3001;

// Add this helper function at the top (after imports):
function sanitizeKeys(obj: Record<string, any>) {
  const validKey = /^[a-zA-Z0-9_-]{1,64}$/;
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => validKey.test(key))
  );
}

// Define tool type for Claude
interface ToolDefinition {
  name: string;
  description: string;
  input_schema: Record<string, any>;
}

// Local registry for tools and handlers
const registeredTools: ToolDefinition[] = [];
const toolHandlers = new Map<string, (...args: any[]) => any>();

const server = new McpServer({
  name: "news",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper to register tools and add to registry
function registerTool(
  name: string,
  description: string,
  parameters: Record<string, any>,
  handler: (...args: any[]) => any
) {
  // Convert snake_case to camelCase for backend API compatibility
  const camelCaseParameters = Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      return [camelKey, value];
    })
  );

  // Register with MCP server using camelCase parameters
  server.tool(name, description, camelCaseParameters, handler);

  // Convert Zod schema to JSON Schema for Claude
  const zodObj = z.object(camelCaseParameters);
  const jsonSchema = zodToJsonSchema(zodObj, {
    name: `${name}_schema`,
    $refStrategy: "none", // Prevent $ref usage
    target: "jsonSchema7", // Use JSON Schema draft-07 for better compatibility
  }) as JsonSchemaObject;

  // Ensure the schema is properly structured for Claude
  const claudeSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    properties: jsonSchema.properties || {},
    required: Object.entries(camelCaseParameters)
      .filter(([_, value]) => !(value instanceof z.ZodOptional))
      .map(([key]) => key),
    additionalProperties: false,
  };

  // Log the full schema for debugging
  console.error(
    `[MCP] Registering tool ${name} with schema:`,
    JSON.stringify(claudeSchema, null, 2)
  );

  registeredTools.push({
    name,
    description,
    input_schema: claudeSchema,
  });

  // Store the handler
  toolHandlers.set(name, handler);
}

// Tool: Get Top Headlines
registerTool(
  "get-top-headlines",
  "Get top news headlines",
  {
    country: z.string().optional().describe("Country code (e.g. us, gb)"),
    category: z
      .string()
      .optional()
      .describe("News category (e.g. business, sports)"),
    sources: z.string().optional().describe("Comma-separated list of sources"),
    q: z.string().optional().describe("Search query"),
    pageSize: z.number().optional().describe("Number of results per page"),
    page: z.number().optional().describe("Page number"),
  },
  async (params) => {
    // Set defaults for required params
    const fullParams = {
      country: params.country ?? "us",
      pageSize: params.pageSize ?? 10,
      page: params.page ?? 1,
      ...params,
    };
    console.error(
      "[MCP] get-top-headlines params (with defaults):",
      fullParams
    );
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/top-headlines`, {
        params: fullParams,
      });
      console.error("[MCP] get-top-headlines response:", response.data);
      return {
        content: [
          { type: "text", text: JSON.stringify(response.data, null, 2) },
        ],
      };
    } catch (error: any) {
      console.error(
        "[MCP] get-top-headlines error:",
        error?.response?.data || error.message
      );
      throw error;
    }
  }
);

// Tool: Search Everything
registerTool(
  "search-news",
  "Search all news articles",
  {
    q: z.string().optional().describe("Search query"),
    sources: z.string().optional().describe("Comma-separated list of sources"),
    domains: z.string().optional().describe("Comma-separated list of domains"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    language: z.string().optional().describe("Language code (e.g. en, es)"),
    sortBy: z
      .string()
      .optional()
      .describe("Sort order (e.g. publishedAt, relevancy)"),
    pageSize: z.number().optional().describe("Number of results per page"),
    page: z.number().optional().describe("Page number"),
  },
  async (params) => {
    // Set defaults for required params
    const fullParams = {
      sortBy: params.sortBy ?? "publishedAt",
      pageSize: params.pageSize ?? 10,
      page: params.page ?? 1,
      ...params,
    };
    console.error("[MCP] search-news params (with defaults):", fullParams);
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/search`, {
        params: fullParams,
      });
      console.error("[MCP] search-news response:", response.data);
      return {
        content: [
          { type: "text", text: JSON.stringify(response.data, null, 2) },
        ],
      };
    } catch (error: any) {
      console.error(
        "[MCP] search-news error:",
        error?.response?.data || error.message
      );
      throw error;
    }
  }
);

// Tool: Get Sources
registerTool(
  "get-sources",
  "Get news sources",
  {
    category: z.string().optional(),
    language: z.string().optional(),
    country: z.string().optional(),
  },
  async (params) => {
    console.error("[MCP] get-sources params:", params);
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/sources`, {
        params,
      });
      console.error("[MCP] get-sources response:", response.data);
      return {
        content: [
          { type: "text", text: JSON.stringify(response.data, null, 2) },
        ],
      };
    } catch (error: any) {
      console.error(
        "[MCP] get-sources error:",
        error?.response?.data || error.message
      );
      throw error;
    }
  }
);

// Tool: Get Category Breakdown
registerTool(
  "get-category-breakdown",
  "Get a breakdown of news articles by category",
  {
    chart_type: z
      .string()
      .optional()
      .describe("Type of chart to render (e.g. 'pie_chart', 'bar_chart')"),
  },
  async (params) => {
    console.error("[MCP] get-category-breakdown called");
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/categories`);
      console.error("[MCP] get-category-breakdown response:", response.data);
      return {
        categories: response.data.categories,
        visualization: params.chart_type || "pie_chart",
      };
    } catch (error) {
      const errObj = error as any;
      console.error(
        "[MCP] get-category-breakdown error:",
        errObj?.response?.data || errObj?.message || String(error)
      );
      throw error;
    }
  }
);

// Create Express app for tool discovery
const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to get all registered tools
app.get("/tools", (req, res) => {
  console.error("[MCP] /tools endpoint called");
  console.error(
    "[MCP] Registered tools:",
    JSON.stringify(registeredTools, null, 2)
  );
  res.json({ tools: registeredTools });
});

// Endpoint to execute a tool
app.post("/execute", async (req, res) => {
  const { name, input } = req.body;

  try {
    // Find the tool in our registry
    const toolDefinition = registeredTools.find((t) => t.name === name);
    if (!toolDefinition) {
      return res.status(404).json({ error: `Tool ${name} not found` });
    }

    // Get the tool handler from our Map
    const handler = toolHandlers.get(name);
    if (!handler) {
      return res
        .status(404)
        .json({ error: `Tool handler for ${name} not found` });
    }

    // Execute the tool
    const result = await handler(input);
    res.json(result);
  } catch (error: any) {
    console.error(`[MCP] Error executing tool ${name}:`, error);
    res.status(500).json({
      error: "Tool execution failed",
      details: error?.response?.data || error.message,
    });
  }
});

async function main() {
  // Start HTTP server for tool discovery
  app.listen(MCP_PORT, () => {
    console.error(
      `MCP Tool Discovery server running on http://localhost:${MCP_PORT}`
    );
  });

  // Connect MCP server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("News MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
