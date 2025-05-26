"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicVisualization } from "@/components/dynamic-visualization";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function HeadlinesAnalysis() {
  const [headlines, setHeadlines] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizationData, setVisualizationData] = useState<{
    data: Array<{ label: string; value: number }>;
    metadata: {
      totalHeadlines: number;
      totalMentions: number;
      timestamp: string;
    };
  } | null>(null);

  const handleAnalyze = async () => {
    // Reset states
    setError(null);
    setIsLoading(true);

    try {
      // Split headlines by newline and filter out empty lines
      const headlinesArray = headlines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (headlinesArray.length === 0) {
        throw new Error("Please enter at least one headline");
      }

      // Send request to analyze headlines
      const response = await fetch("/api/analyze/headlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headlines: headlinesArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze headlines");
      }

      const data = await response.json();

      // Transform the data into the format expected by DynamicVisualization
      const visualizationData = {
        data: data.mentions.map((mention: { name: string; count: number }) => ({
          label: mention.name,
          value: mention.count,
        })),
        metadata: {
          totalHeadlines: data.totalHeadlines,
          totalMentions: data.totalMentions,
          timestamp: new Date().toISOString(),
        },
      };

      setVisualizationData(visualizationData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error analyzing headlines:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Headlines Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={headlines}
              onChange={(e) => setHeadlines(e.target.value)}
              placeholder="Enter headlines (one per line)..."
              className="min-h-[200px]"
              disabled={isLoading}
            />
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !headlines.trim()}
              className="w-full"
            >
              {isLoading ? "Analyzing..." : "Analyze Headlines"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {visualizationData && (
        <DynamicVisualization
          type="bar"
          data={visualizationData.data}
          title="People Mentioned in Headlines"
          description={`Analysis of ${
            visualizationData.metadata.totalHeadlines
          } headlines, finding ${
            visualizationData.metadata.totalMentions
          } total mentions. Analyzed at ${new Date(
            visualizationData.metadata.timestamp
          ).toLocaleString()}`}
          className="w-full"
        />
      )}

      {!visualizationData && !error && !isLoading && (
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Enter headlines above to see a visualization of people mentioned.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
