"use client";

import React from "react";
import { getComponentByName } from "@/lib/component-registry";
import { composeComponents } from "@/lib/component-composer";
import {
  DynamicRenderer,
  DynamicSubComponent,
} from "@/components/dynamic-renderer";
import { cn } from "@/lib/utils";

interface VisualizationProps {
  type: "bar" | "pie" | "line";
  data: Array<{ label: string; value: number }>;
  title?: string;
  description?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
  showLegend?: boolean;
}

export function DynamicVisualization({
  type,
  data,
  title,
  description,
  className,
  orientation = "vertical",
  showLegend = true,
}: VisualizationProps) {
  // Get the appropriate chart component
  const chartComponent = getComponentByName(
    type === "bar" ? "BarChart" : type === "pie" ? "PieChart" : "LineChart"
  );

  if (!chartComponent) {
    return (
      <div className="p-4 border border-red-500 rounded-md">
        <h3 className="text-red-500 font-bold">Visualization Error</h3>
        <p className="text-sm text-red-400">
          Chart component not found: {type}Chart
        </p>
      </div>
    );
  }

  // Prepare chart props based on type
  const chartProps = {
    data,
    showLegend,
    ...(type === "bar" && { orientation }),
    ...(type === "pie" && { innerRadius: 0 }),
  };

  // Create a card to contain the visualization
  return composeComponents(
    "Card",
    [
      {
        name: "CardHeader",
        options: {
          children: (
            <>
              {title && (
                <DynamicSubComponent
                  parent={getComponentByName("Card")!}
                  name="CardTitle"
                >
                  {title}
                </DynamicSubComponent>
              )}
              {description && (
                <DynamicSubComponent
                  parent={getComponentByName("Card")!}
                  name="CardDescription"
                >
                  {description}
                </DynamicSubComponent>
              )}
            </>
          ),
        },
      },
      {
        name: "CardContent",
        options: {
          className: cn("p-0", className),
          children: (
            <DynamicRenderer
              component={chartComponent}
              props={chartProps}
              className="h-[400px] w-full"
            />
          ),
        },
      },
    ],
    {
      className: "w-full",
    }
  );
}

// Example usage:
/*
<DynamicVisualization
  type="bar"
  data={[
    { label: "John Doe", value: 5 },
    { label: "Jane Smith", value: 3 },
    { label: "Bob Johnson", value: 2 },
  ]}
  title="People Mentioned in Headlines"
  description="Frequency of mentions in recent news headlines"
  orientation="horizontal"
/>
*/
