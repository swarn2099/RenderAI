import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Log request start
    console.log("[Headlines Analysis] Starting request processing");

    const body = await req.json();
    const { headlines, visualizationType = "bar" } = body;

    // Input validation
    if (!headlines || !Array.isArray(headlines)) {
      console.error("[Headlines Analysis] Invalid input:", { headlines });
      return NextResponse.json(
        { error: "Headlines must be provided as an array" },
        { status: 400 }
      );
    }

    if (headlines.length === 0) {
      console.error("[Headlines Analysis] Empty headlines array");
      return NextResponse.json(
        { error: "At least one headline must be provided" },
        { status: 400 }
      );
    }

    // Log request details
    console.log("[Headlines Analysis] Processing request:", {
      headlineCount: headlines.length,
      visualizationType,
    });

    // Create a prompt for Claude to analyze the headlines
    const prompt = `Please analyze the following news headlines and extract the names of people mentioned, along with their frequency of mention. Return the data in a JSON format suitable for a ${visualizationType} chart visualization.

Headlines:
${headlines.join("\n")}

Please return ONLY a JSON object with this structure:
{
  "categories": [
    { "name": "Person Name", "count": number },
    ...
  ],
  "visualization": "${visualizationType}_chart"
}

Focus on:
1. Extract full names of people mentioned
2. Count how many times each person is mentioned
3. Sort by frequency (highest to lowest)
4. Include only people mentioned more than once
5. Return a maximum of 10 people`;

    console.log("[Headlines Analysis] Sending request to Claude");

    // Get analysis from Claude
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("[Headlines Analysis] Received response from Claude");

    // Parse Claude's response
    const contentBlock = message.content[0];
    if (contentBlock.type !== "text") {
      console.error(
        "[Headlines Analysis] Unexpected response type:",
        contentBlock.type
      );
      return NextResponse.json(
        { error: "Unexpected response type from Claude" },
        { status: 500 }
      );
    }

    const response = contentBlock.text;
    let parsed;
    try {
      parsed = JSON.parse(response);
      console.log("[Headlines Analysis] Successfully parsed Claude's response");
    } catch (error) {
      console.error("[Headlines Analysis] Failed to parse Claude's response:", {
        error,
        response,
      });
      return NextResponse.json(
        { error: "Failed to parse analysis results" },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!parsed.categories || !Array.isArray(parsed.categories)) {
      console.error("[Headlines Analysis] Invalid response structure:", parsed);
      return NextResponse.json(
        { error: "Invalid analysis results format" },
        { status: 500 }
      );
    }

    // Transform the data for the visualization component
    const data = parsed.categories.map((cat: any) => ({
      label: cat.name,
      value: cat.count,
    }));

    const result = {
      data,
      visualization: parsed.visualization,
      metadata: {
        totalHeadlines: headlines.length,
        totalMentions: data.reduce(
          (sum: number, item: any) => sum + item.value,
          0
        ),
        timestamp: new Date().toISOString(),
      },
    };

    console.log("[Headlines Analysis] Successfully processed request:", {
      dataPoints: data.length,
      totalMentions: result.metadata.totalMentions,
    });

    return NextResponse.json(result);
  } catch (error) {
    // Log the full error details
    console.error("[Headlines Analysis] Error processing request:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to analyze headlines",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
