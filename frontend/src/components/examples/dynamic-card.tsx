"use client";

import React from "react";
import { getComponentByName } from "@/lib/component-registry";
import {
  DynamicRenderer,
  DynamicSubComponent,
} from "@/components/dynamic-renderer";
import { composeComponents } from "@/lib/component-composer";

// Example 1: Using DynamicRenderer directly
export function DynamicCardExample1() {
  const card = getComponentByName("Card");
  if (!card) return null;

  return (
    <DynamicRenderer
      component={card}
      props={{
        className: "w-full max-w-sm",
        variant: "outline",
      }}
    >
      <DynamicSubComponent
        parent={card}
        name="CardHeader"
        props={{
          className: "bg-gray-100",
        }}
      >
        <DynamicSubComponent parent={card} name="CardTitle">
          Card Title
        </DynamicSubComponent>
        <DynamicSubComponent parent={card} name="CardDescription">
          Card Description
        </DynamicSubComponent>
      </DynamicSubComponent>
      <DynamicSubComponent parent={card} name="CardContent">
        <p>This is the card content.</p>
      </DynamicSubComponent>
      <DynamicSubComponent
        parent={card}
        name="CardFooter"
        props={{
          className: "bg-gray-50",
        }}
      >
        <p>Card Footer</p>
      </DynamicSubComponent>
    </DynamicRenderer>
  );
}

// Example 2: Using composeComponents
export function DynamicCardExample2() {
  return composeComponents(
    "Card",
    [
      {
        name: "CardHeader",
        options: {
          className: "bg-gray-100",
          children: (
            <>
              <DynamicSubComponent
                parent={getComponentByName("Card")!}
                name="CardTitle"
              >
                Card Title
              </DynamicSubComponent>
              <DynamicSubComponent
                parent={getComponentByName("Card")!}
                name="CardDescription"
              >
                Card Description
              </DynamicSubComponent>
            </>
          ),
        },
      },
      {
        name: "CardContent",
        options: {
          children: <p>This is the card content.</p>,
        },
      },
      {
        name: "CardFooter",
        options: {
          className: "bg-gray-50",
          children: <p>Card Footer</p>,
        },
      },
    ],
    {
      className: "w-full max-w-sm",
      props: {
        variant: "outline",
      },
    }
  );
}

// Example 3: Dynamic Card with Form Elements
export function DynamicCardWithForm() {
  const card = getComponentByName("Card");
  const input = getComponentByName("Input");
  const button = getComponentByName("Button");

  if (!card || !input || !button) return null;

  return (
    <DynamicRenderer
      component={card}
      props={{
        className: "w-full max-w-sm",
      }}
    >
      <DynamicSubComponent parent={card} name="CardHeader">
        <DynamicSubComponent parent={card} name="CardTitle">
          Login Form
        </DynamicSubComponent>
      </DynamicSubComponent>
      <DynamicSubComponent parent={card} name="CardContent">
        <div className="space-y-4">
          <DynamicRenderer
            component={input}
            props={{
              type: "email",
              placeholder: "Email",
              className: "w-full",
            }}
          />
          <DynamicRenderer
            component={input}
            props={{
              type: "password",
              placeholder: "Password",
              className: "w-full",
            }}
          />
        </div>
      </DynamicSubComponent>
      <DynamicSubComponent parent={card} name="CardFooter">
        <DynamicRenderer
          component={button}
          props={{
            className: "w-full",
            variant: "default",
          }}
        >
          Login
        </DynamicRenderer>
      </DynamicSubComponent>
    </DynamicRenderer>
  );
}

// Example 4: Dynamic Card with Data Display
export function DynamicCardWithData() {
  const card = getComponentByName("Card");
  const table = getComponentByName("Table");

  if (!card || !table) return null;

  const data = [
    { id: 1, name: "Item 1", value: 100 },
    { id: 2, name: "Item 2", value: 200 },
    { id: 3, name: "Item 3", value: 300 },
  ];

  return (
    <DynamicRenderer
      component={card}
      props={{
        className: "w-full",
      }}
    >
      <DynamicSubComponent parent={card} name="CardHeader">
        <DynamicSubComponent parent={card} name="CardTitle">
          Data Table
        </DynamicSubComponent>
      </DynamicSubComponent>
      <DynamicSubComponent parent={card} name="CardContent">
        <DynamicRenderer
          component={table}
          props={{
            className: "w-full",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </DynamicRenderer>
      </DynamicSubComponent>
    </DynamicRenderer>
  );
}
