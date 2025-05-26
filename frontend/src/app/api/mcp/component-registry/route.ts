import { NextResponse } from "next/server";
import {
  ComponentCapability,
  componentRegistry,
  getComponentsByCategory,
  getComponentsByDataType,
  getComponentsByUseCase,
  getComponentByName,
  getSubComponents,
  getComponentsThatCanContain,
  getComponentsThatCanBeContainedBy,
  getComponentsByAriaRole,
  getComponentsByVariant,
  getComponentsByInteraction,
  getComponentsByState,
  getComponentsByEvent,
  getComponentsByPerformance,
  getComponentsByValidation,
  getComponentsByAccessibility,
  getComponentsByStyling,
  getComponentsByComposition,
} from "@/lib/component-registry";

// Helper function to format component data for Claude
function formatComponentForClaude(component: ComponentCapability) {
  return {
    name: component.name,
    category: component.category,
    description: component.description,
    useCases: component.useCases,
    dataTypes: component.dataTypes,
    keyProps: component.keyProps.map(
      (prop: ComponentCapability["keyProps"][0]) => ({
        name: prop.name,
        type: prop.type,
        description: prop.description,
        required: prop.required || false,
        default: prop.default,
        validation: prop.validation,
      })
    ),
    subComponents: component.subComponents || [],
    composition: component.composition || {},
    accessibility: component.accessibility || {},
    styling: component.styling || {},
    interactions: component.interactions || {},
    state: component.state || {},
    events: component.events || {},
    performance: component.performance || {},
  };
}

// Helper function to format query response
function formatQueryResponse(
  data: ComponentCapability | ComponentCapability[],
  query: string
) {
  return {
    query,
    timestamp: new Date().toISOString(),
    data: Array.isArray(data)
      ? data.map(formatComponentForClaude)
      : formatComponentForClaude(data),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const category = searchParams.get(
      "category"
    ) as ComponentCapability["category"];
    const dataType = searchParams.get("dataType");
    const useCase = searchParams.get("useCase");
    const name = searchParams.get("name");
    const ariaRole = searchParams.get("ariaRole");
    const variant = searchParams.get("variant");
    const interaction = searchParams.get(
      "interaction"
    ) as keyof ComponentCapability["interactions"];
    const state = searchParams.get(
      "state"
    ) as keyof ComponentCapability["state"];
    const event = searchParams.get(
      "event"
    ) as keyof ComponentCapability["events"];
    const performance = searchParams.get(
      "performance"
    ) as keyof ComponentCapability["performance"];
    const validation = searchParams.get(
      "validation"
    ) as keyof ComponentCapability["keyProps"][0]["validation"];
    const accessibility = searchParams.get(
      "accessibility"
    ) as keyof ComponentCapability["accessibility"];
    const styling = searchParams.get(
      "styling"
    ) as keyof ComponentCapability["styling"];
    const composition = searchParams.get(
      "composition"
    ) as keyof ComponentCapability["composition"];

    let response;

    // Handle different query types
    if (category) {
      response = formatQueryResponse(
        getComponentsByCategory(category),
        `components by category: ${category}`
      );
    } else if (dataType) {
      response = formatQueryResponse(
        getComponentsByDataType(dataType),
        `components by data type: ${dataType}`
      );
    } else if (useCase) {
      response = formatQueryResponse(
        getComponentsByUseCase(useCase),
        `components by use case: ${useCase}`
      );
    } else if (name) {
      const component = getComponentByName(name);
      if (component) {
        response = formatQueryResponse(component, `component by name: ${name}`);
      }
    } else if (ariaRole) {
      response = formatQueryResponse(
        getComponentsByAriaRole(ariaRole),
        `components by ARIA role: ${ariaRole}`
      );
    } else if (variant) {
      response = formatQueryResponse(
        getComponentsByVariant(variant),
        `components by variant: ${variant}`
      );
    } else if (interaction) {
      response = formatQueryResponse(
        getComponentsByInteraction(interaction),
        `components by interaction: ${interaction}`
      );
    } else if (state) {
      response = formatQueryResponse(
        getComponentsByState(state),
        `components by state: ${state}`
      );
    } else if (event) {
      response = formatQueryResponse(
        getComponentsByEvent(event),
        `components by event: ${event}`
      );
    } else if (performance) {
      response = formatQueryResponse(
        getComponentsByPerformance(performance),
        `components by performance: ${performance}`
      );
    } else if (validation) {
      response = formatQueryResponse(
        getComponentsByValidation(validation),
        `components by validation: ${validation}`
      );
    } else if (accessibility) {
      response = formatQueryResponse(
        getComponentsByAccessibility(accessibility),
        `components by accessibility: ${accessibility}`
      );
    } else if (styling) {
      response = formatQueryResponse(
        getComponentsByStyling(styling),
        `components by styling: ${styling}`
      );
    } else if (composition) {
      response = formatQueryResponse(
        getComponentsByComposition(composition),
        `components by composition: ${composition}`
      );
    } else if (query) {
      // Handle natural language queries
      const queryLower = query.toLowerCase();

      // Try to match query to component properties
      const matchingComponents = componentRegistry.filter((component) => {
        return (
          component.name.toLowerCase().includes(queryLower) ||
          component.description.toLowerCase().includes(queryLower) ||
          component.useCases.some((uc) =>
            uc.toLowerCase().includes(queryLower)
          ) ||
          component.dataTypes.some((dt) =>
            dt.toLowerCase().includes(queryLower)
          )
        );
      });

      response = formatQueryResponse(
        matchingComponents,
        `components matching query: ${query}`
      );
    } else {
      // Return all components if no specific query is provided
      response = formatQueryResponse(componentRegistry, "all components");
    }

    return NextResponse.json({
      success: true,
      ...response,
      metadata: {
        totalComponents: componentRegistry.length,
        categories: Array.from(
          new Set(componentRegistry.map((c) => c.category))
        ),
        dataTypes: Array.from(
          new Set(componentRegistry.flatMap((c) => c.dataTypes))
        ),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in component registry API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch component registry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST endpoint for more complex queries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, filters, sort, limit } = body;

    let components = [...componentRegistry];

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        components = components.filter((component) => {
          if (key === "category") return component.category === value;
          if (key === "dataType")
            return component.dataTypes.includes(value as string);
          if (key === "useCase")
            return component.useCases.some((uc) =>
              uc.includes(value as string)
            );
          if (key === "hasSubComponents")
            return (component.subComponents?.length ?? 0) > 0;
          if (key === "isAccessible")
            return component.accessibility?.screenReaderSupport;
          return true;
        });
      });
    }

    // Apply sorting if provided
    if (sort) {
      const [field, direction] = sort.split(":");
      components.sort((a, b) => {
        const aValue = String(a[field as keyof ComponentCapability] ?? "");
        const bValue = String(b[field as keyof ComponentCapability] ?? "");
        return direction === "desc"
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      });
    }

    // Apply limit if provided
    if (limit) {
      components = components.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      query,
      timestamp: new Date().toISOString(),
      data: components.map(formatComponentForClaude),
      metadata: {
        totalResults: components.length,
        appliedFilters: filters || {},
        sort: sort || "none",
        limit: limit || "none",
      },
    });
  } catch (error) {
    console.error("Error in component registry POST API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process component registry query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
