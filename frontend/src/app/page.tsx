"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types for Claude's response
type ContentBlock = {
  type: "text" | "tool_use" | "tool_result";
  text?: string;
  tool_use_id?: string;
  tool_name?: string;
  input?: Record<string, any>;
  result?: any;
  content?: any;
};

type Message = {
  role: "user" | "assistant";
  content: ContentBlock[];
};

type CategoryData = {
  category: string;
  count: number;
};

type ChartData = {
  name: string;
  value: number;
};

type NewsArticle = {
  title: string;
  source: string;
  author: string;
  description: string;
  publishedAt: string;
  url: string;
  urlToImage: string;
  content: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    const userMessage: Message = {
      role: "user",
      content: [{ type: "text", text: prompt }],
    };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const response = await fetch("/api/v1/claude/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Received response:", data); // Debug log

      if (!data.content || !Array.isArray(data.content)) {
        throw new Error("Invalid response format from server");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred"
              }`,
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (content: ContentBlock[]) => {
    return content.map((block, index) => {
      switch (block.type) {
        case "text":
          return (
            <p key={index} className="whitespace-pre-wrap">
              {block.text}
            </p>
          );
        case "tool_result": {
          let parsed: any;
          try {
            parsed = JSON.parse(block.content);
          } catch {
            parsed = null;
          }
          const viz = parsed?.visualization;
          const categories = parsed?.categories;
          const articles = parsed?.articles;

          // Handle news articles table
          if (articles && Array.isArray(articles)) {
            return (
              <div key={index} className="w-full overflow-auto">
                <Table>
                  <TableCaption>Top News Headlines</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Published</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article: NewsArticle, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {article.title}
                          </a>
                        </TableCell>
                        <TableCell>{article.source}</TableCell>
                        <TableCell>{article.author || "Unknown"}</TableCell>
                        <TableCell>
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          }

          // Handle existing chart visualizations
          if (viz && Array.isArray(categories)) {
            const data: ChartData[] = categories.map((cat: any) => ({
              name: cat.name,
              value: cat.count,
            }));
            // Generate chartConfig dynamically
            const chartConfig = data.reduce((acc, d, i) => {
              acc[d.name] = {
                label: d.name,
                color: `hsl(${(i * 360) / data.length}, 70%, 50%)`,
              };
              return acc;
            }, {} as Record<string, { label: string; color: string }>);
            // Pie Chart
            if (viz === "pie_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.map((entry, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={chartConfig[entry.name]?.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Bar Chart
            if (viz === "bar_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8">
                        <LabelList dataKey="value" position="top" />
                        {data.map((entry, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={chartConfig[entry.name]?.color}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Line Chart
            if (viz === "line_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Area Chart
            if (viz === "area_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Composed Chart
            if (viz === "composed_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" barSize={20} fill="#8884d8" />
                      <Line type="monotone" dataKey="value" stroke="#ff7300" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Radar Chart
            if (viz === "radar_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Categories"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Scatter Chart
            if (viz === "scatter_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis dataKey="name" />
                      <YAxis dataKey="value" />
                      <Tooltip />
                      <Legend />
                      <Scatter name="Categories" data={data} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Radial Bar Chart
            if (viz === "radial_bar_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="10%"
                      outerRadius="80%"
                      data={data}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar dataKey="value" fill="#8884d8" />
                      <Legend />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
            // Funnel Chart
            if (viz === "funnel_chart") {
              return (
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                  key={index}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <Tooltip />
                      <Legend />
                      <Funnel dataKey="value" data={data} isAnimationActive />
                    </FunnelChart>
                  </ResponsiveContainer>
                </ChartContainer>
              );
            }
          }
          // fallback: show as preformatted text
          return (
            <pre key={index} className="whitespace-pre-wrap">
              {block.content}
            </pre>
          );
        }
        default:
          return null;
      }
    });
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI-Driven Data Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me to visualize data..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {messages.map((message, i) => (
          <Card
            key={i}
            className={message.role === "assistant" ? "bg-muted" : ""}
          >
            <CardContent className="pt-6">
              {renderContent(message.content)}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
