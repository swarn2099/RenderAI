"use client";

import React from "react";
import {
  DynamicCardExample1,
  DynamicCardExample2,
  DynamicCardWithForm,
  DynamicCardWithData,
} from "@/components/examples/dynamic-card";

export default function DynamicRendererExamples() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dynamic Renderer Examples</h1>
        <p className="text-gray-500">
          Examples of using the dynamic renderer to compose UI components
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Example 1 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Example 1: Basic Card</h2>
            <p className="text-sm text-gray-500">
              Using DynamicRenderer and DynamicSubComponent directly
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <DynamicCardExample1 />
          </div>
        </div>

        {/* Example 2 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Example 2: Composed Card</h2>
            <p className="text-sm text-gray-500">
              Using the composeComponents helper function
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <DynamicCardExample2 />
          </div>
        </div>

        {/* Example 3 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Example 3: Card with Form</h2>
            <p className="text-sm text-gray-500">
              Combining multiple components in a card
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <DynamicCardWithForm />
          </div>
        </div>

        {/* Example 4 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Example 4: Card with Data</h2>
            <p className="text-sm text-gray-500">
              Displaying tabular data in a card
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <DynamicCardWithData />
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold">How to Use</h2>
        <div className="prose prose-sm max-w-none">
          <h3>1. Using DynamicRenderer Directly</h3>
          <pre className="bg-gray-100 p-4 rounded-lg">
            {`<DynamicRenderer
  component={getComponentByName("Card")}
  props={{
    className: "w-full max-w-sm",
    variant: "outline",
  }}
>
  <DynamicSubComponent
    parent={card}
    name="CardHeader"
  >
    <DynamicSubComponent
      parent={card}
      name="CardTitle"
    >
      Card Title
    </DynamicSubComponent>
  </DynamicSubComponent>
</DynamicRenderer>`}
          </pre>

          <h3>2. Using composeComponents</h3>
          <pre className="bg-gray-100 p-4 rounded-lg">
            {`composeComponents(
  "Card",
  [
    {
      name: "CardHeader",
      options: {
        className: "bg-gray-100",
        children: (
          <DynamicSubComponent
            parent={getComponentByName("Card")!}
            name="CardTitle"
          >
            Card Title
          </DynamicSubComponent>
        ),
      },
    },
    {
      name: "CardContent",
      options: {
        children: <p>Content</p>,
      },
    },
  ],
  {
    className: "w-full max-w-sm",
    props: {
      variant: "outline",
    },
  }
)`}
          </pre>

          <h3>Key Features</h3>
          <ul>
            <li>
              <strong>Component Validation:</strong> Validates component props
              and composition rules
            </li>
            <li>
              <strong>Accessibility:</strong> Automatically adds ARIA roles and
              properties
            </li>
            <li>
              <strong>Type Safety:</strong> Full TypeScript support for
              component props and metadata
            </li>
            <li>
              <strong>Composition:</strong> Supports both direct rendering and
              declarative composition
            </li>
            <li>
              <strong>Error Handling:</strong> Graceful error display for
              invalid components or props
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
