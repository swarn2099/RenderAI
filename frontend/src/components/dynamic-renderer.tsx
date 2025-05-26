"use client";

import React from "react";
import { ComponentCapability } from "@/lib/component-registry";
import * as shadcn from "@/components/ui";
import { cn } from "@/lib/utils";

// Type for the props that can be passed to any component
type ComponentProps = {
  [key: string]: any;
};

// Type for the renderer props
interface DynamicRendererProps {
  component: ComponentCapability;
  props?: ComponentProps;
  children?: React.ReactNode;
  className?: string;
}

// Helper function to validate props against component metadata
function validateProps(component: ComponentCapability, props: ComponentProps) {
  const errors: string[] = [];

  // Check required props
  component.keyProps.forEach((keyProp) => {
    if (keyProp.required && props[keyProp.name] === undefined) {
      errors.push(`Missing required prop: ${keyProp.name}`);
    }
  });

  // Validate prop types and values
  Object.entries(props).forEach(([key, value]) => {
    const propDef = component.keyProps.find((p) => p.name === key);
    if (propDef) {
      // Type validation
      if (propDef.type.includes("|")) {
        const validTypes = propDef.type
          .split("|")
          .map((t) => t.trim().replace(/['"]/g, ""));
        if (!validTypes.includes(typeof value)) {
          errors.push(
            `Invalid type for prop ${key}: expected one of ${validTypes.join(
              ", "
            )}`
          );
        }
      }

      // Validation rules
      if (propDef.validation) {
        if (typeof value === "number") {
          if (
            propDef.validation.min !== undefined &&
            value < propDef.validation.min
          ) {
            errors.push(
              `Value for ${key} must be greater than or equal to ${propDef.validation.min}`
            );
          }
          if (
            propDef.validation.max !== undefined &&
            value > propDef.validation.max
          ) {
            errors.push(
              `Value for ${key} must be less than or equal to ${propDef.validation.max}`
            );
          }
        }
        if (propDef.validation.pattern && typeof value === "string") {
          const regex = new RegExp(propDef.validation.pattern);
          if (!regex.test(value)) {
            errors.push(`Value for ${key} does not match required pattern`);
          }
        }
      }
    }
  });

  return errors;
}

// Helper function to get the actual component from shadcn
function getComponentFromShadcn(name: string) {
  // Handle special cases for subcomponents
  const subComponentMap: { [key: string]: string } = {
    AccordionItem: "Accordion.Item",
    AccordionTrigger: "Accordion.Trigger",
    AccordionContent: "Accordion.Content",
    CardHeader: "Card.Header",
    CardTitle: "Card.Title",
    CardDescription: "Card.Description",
    CardContent: "Card.Content",
    CardFooter: "Card.Footer",
    // Add more subcomponent mappings as needed
  };

  const componentPath = subComponentMap[name] || name;
  const parts = componentPath.split(".");
  let component = (shadcn as any)[parts[0]];

  for (let i = 1; i < parts.length; i++) {
    component = component[parts[i]];
  }

  return component;
}

// Helper function to process component props
function processProps(component: ComponentCapability, props: ComponentProps) {
  const processedProps: ComponentProps = { ...props };

  // Add accessibility props
  if (component.accessibility) {
    if (component.accessibility.ariaRole) {
      processedProps["role"] = component.accessibility.ariaRole;
    }
    if (component.accessibility.ariaProps) {
      Object.assign(processedProps, component.accessibility.ariaProps);
    }
  }

  // Add default props
  component.keyProps.forEach((prop) => {
    if (prop.default !== undefined && processedProps[prop.name] === undefined) {
      processedProps[prop.name] = prop.default;
    }
  });

  return processedProps;
}

export function DynamicRenderer({
  component,
  props = {},
  children,
  className,
}: DynamicRendererProps) {
  // Validate props
  const validationErrors = validateProps(component, props);
  if (validationErrors.length > 0) {
    console.error(`Validation errors for ${component.name}:`, validationErrors);
    return (
      <div className="p-4 border border-red-500 rounded-md">
        <h3 className="text-red-500 font-bold">Component Error</h3>
        <p className="text-sm text-red-400">
          {component.name} validation failed:
        </p>
        <ul className="list-disc list-inside text-sm text-red-400">
          {validationErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  try {
    // Get the actual component from shadcn
    const Component = getComponentFromShadcn(component.name);
    if (!Component) {
      throw new Error(`Component ${component.name} not found in shadcn`);
    }

    // Process props
    const processedProps = processProps(component, props);

    // Add className if provided
    if (className) {
      processedProps.className = cn(processedProps.className, className);
    }

    // Render the component
    return <Component {...processedProps}>{children}</Component>;
  } catch (error) {
    console.error(`Error rendering ${component.name}:`, error);
    return (
      <div className="p-4 border border-red-500 rounded-md">
        <h3 className="text-red-500 font-bold">Component Error</h3>
        <p className="text-sm text-red-400">
          Failed to render {component.name}: {(error as Error).message}
        </p>
      </div>
    );
  }
}

// Helper component for rendering subcomponents
export function DynamicSubComponent({
  parent,
  name,
  props = {},
  children,
  className,
}: {
  parent: ComponentCapability;
  name: string;
  props?: ComponentProps;
  children?: React.ReactNode;
  className?: string;
}) {
  // Verify that this is a valid subcomponent
  if (!parent.subComponents?.includes(name)) {
    console.error(`${name} is not a valid subcomponent of ${parent.name}`);
    return null;
  }

  // Create a component capability for the subcomponent
  const subComponent: ComponentCapability = {
    ...parent,
    name,
    // You might want to add specific metadata for subcomponents here
  };

  return (
    <DynamicRenderer
      component={subComponent}
      props={props}
      className={className}
    >
      {children}
    </DynamicRenderer>
  );
}

// Example usage:
/*
<DynamicRenderer
  component={getComponentByName("Card")}
  props={{
    className: "w-full max-w-sm",
  }}
>
  <DynamicSubComponent
    parent={getComponentByName("Card")}
    name="CardHeader"
  >
    <DynamicSubComponent
      parent={getComponentByName("Card")}
      name="CardTitle"
    >
      Card Title
    </DynamicSubComponent>
  </DynamicSubComponent>
  <DynamicSubComponent
    parent={getComponentByName("Card")}
    name="CardContent"
  >
    Card Content
  </DynamicSubComponent>
</DynamicRenderer>
*/
