import { ComponentCapability, getComponentByName } from "./component-registry";
import {
  DynamicRenderer,
  DynamicSubComponent,
} from "@/components/dynamic-renderer";
import {
  ErrorMessage,
  CompositionErrorMessage,
} from "@/components/error-boundary";
import React from "react";

// Type for the composition options
interface CompositionOptions {
  className?: string;
  props?: Record<string, any>;
  children?: React.ReactNode;
}

// Type for child component configuration
interface ChildComponentConfig {
  name: string;
  options?: CompositionOptions;
}

// Helper function to validate component composition
function validateComposition(
  parent: ComponentCapability,
  children: ChildComponentConfig[]
): string[] {
  const errors: string[] = [];

  for (const child of children) {
    const childComponent = getComponentByName(child.name);
    if (!childComponent) continue;

    // Check if child can be contained by parent
    if (
      parent.composition?.canContain &&
      !parent.composition.canContain.includes("*") &&
      !parent.composition.canContain.includes(childComponent.name)
    ) {
      const allowedChildren = parent.composition.canContain.join(", ");
      errors.push(
        `${childComponent.name} cannot be contained by ${parent.name}. Allowed children: ${allowedChildren}`
      );
    }

    // Check if parent can be contained by its container
    if (
      childComponent.composition?.canBeContainedBy &&
      !childComponent.composition.canBeContainedBy.includes("*") &&
      !childComponent.composition.canBeContainedBy.includes(parent.name)
    ) {
      const allowedContainers =
        childComponent.composition.canBeContainedBy.join(", ");
      errors.push(
        `${childComponent.name} cannot be contained by ${parent.name}. Allowed containers: ${allowedContainers}`
      );
    }
  }

  return errors;
}

// Helper function to compose components
export function composeComponents(
  parentName: string,
  children: ChildComponentConfig[],
  options: CompositionOptions = {}
): React.ReactElement {
  const parent = getComponentByName(parentName);
  if (!parent) {
    return (
      <ErrorMessage
        title="Component Error"
        message={`Parent component ${parentName} not found`}
      />
    );
  }

  // Validate all child components exist
  const missingChildren = children.filter(
    (child) => !getComponentByName(child.name)
  );
  if (missingChildren.length > 0) {
    return (
      <ErrorMessage
        title="Component Error"
        message={`Child components not found: ${missingChildren
          .map((child) => child.name)
          .join(", ")}`}
      />
    );
  }

  // Validate composition rules
  const compositionErrors = validateComposition(parent, children);
  if (compositionErrors.length > 0) {
    return <CompositionErrorMessage errors={compositionErrors} />;
  }

  // Render the composition
  return (
    <DynamicRenderer
      component={parent}
      props={options.props}
      className={options.className}
    >
      {children.map((child, index) => {
        const childComponent = getComponentByName(child.name);
        if (!childComponent) return null;
        const childOptions = child.options || {};

        // If it's a subcomponent, use DynamicSubComponent
        if (parent.subComponents?.includes(child.name)) {
          return (
            <DynamicSubComponent
              key={index}
              parent={parent}
              name={child.name}
              props={childOptions.props}
              className={childOptions.className}
            >
              {childOptions.children}
            </DynamicSubComponent>
          );
        }

        // Otherwise, use DynamicRenderer
        return (
          <DynamicRenderer
            key={index}
            component={childComponent}
            props={childOptions.props}
            className={childOptions.className}
          >
            {childOptions.children}
          </DynamicRenderer>
        );
      })}
    </DynamicRenderer>
  );
}

// Example usage:
/*
composeComponents("Card", [
  {
    name: "CardHeader",
    options: {
      className: "bg-gray-100",
      children: composeComponents("CardTitle", [
        {
          name: "Text",
          options: {
            children: "Card Title",
          },
        },
      ]),
    },
  },
  {
    name: "CardContent",
    options: {
      children: "Card Content",
    },
  },
], {
  className: "w-full max-w-sm",
  props: {
    variant: "outline",
  },
});
*/
