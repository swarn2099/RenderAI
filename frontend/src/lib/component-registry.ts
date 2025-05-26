// Export the interface
export interface ComponentCapability {
  name: string;
  category:
    | "layout"
    | "data-display"
    | "form"
    | "feedback"
    | "navigation"
    | "visualization"
    | "overlay"
    | "typography"
    | "media"
    | "interaction";
  description: string;
  useCases: string[];
  dataTypes: string[];
  keyProps: {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    default?: any;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      custom?: string;
    };
  }[];
  subComponents?: string[];
  composition?: {
    canContain: string[];
    canBeContainedBy: string[];
    recommendedContainers?: string[];
    recommendedChildren?: string[];
  };
  accessibility?: {
    ariaRole?: string;
    keyboardNavigation?: boolean;
    screenReaderSupport?: boolean;
    ariaProps?: Record<string, string>;
    focusManagement?: boolean;
    focusTrap?: boolean;
  };
  styling?: {
    variants?: string[];
    sizes?: string[];
    themes?: string[];
    customStyles?: string[];
    responsive?: boolean;
    animations?: string[];
  };
  interactions?: {
    hover?: boolean;
    focus?: boolean;
    active?: boolean;
    disabled?: boolean;
    loading?: boolean;
    dragAndDrop?: boolean;
    resizable?: boolean;
    draggable?: boolean;
  };
  state?: {
    controlled?: boolean;
    uncontrolled?: boolean;
    defaultState?: Record<string, any>;
    stateTransitions?: string[];
  };
  events?: {
    onChange?: string;
    onClick?: string;
    onFocus?: string;
    onBlur?: string;
    onKeyDown?: string;
    custom?: string[];
  };
  performance?: {
    memoization?: boolean;
    virtualization?: boolean;
    lazyLoading?: boolean;
    debounce?: boolean;
    throttle?: boolean;
  };
}

export const componentRegistry: ComponentCapability[] = [
  // Layout Components
  {
    name: "Accordion",
    category: "layout",
    description:
      "A vertically stacked set of interactive headings that each reveal a section of content",
    useCases: [
      "collapsible content sections",
      "FAQ sections",
      "expandable details",
      "content organization",
    ],
    dataTypes: ["text", "mixed"],
    subComponents: ["AccordionItem", "AccordionTrigger", "AccordionContent"],
    keyProps: [
      {
        name: "type",
        type: "'single' | 'multiple'",
        description: "Type of accordion behavior",
        required: true,
        default: "single",
      },
      {
        name: "collapsible",
        type: "boolean",
        description: "Whether all items can be collapsed",
        default: false,
      },
    ],
    composition: {
      canContain: ["AccordionItem"],
      canBeContainedBy: ["Card", "Dialog", "Sheet"],
    },
    accessibility: {
      ariaRole: "region",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "AspectRatio",
    category: "layout",
    description: "A component that maintains a consistent width/height ratio",
    useCases: [
      "responsive images",
      "video containers",
      "maintaining proportions",
      "consistent layouts",
    ],
    dataTypes: ["media", "mixed"],
    keyProps: [
      {
        name: "ratio",
        type: "number",
        description: "The width/height ratio (e.g., 16/9 = 1.777)",
        required: true,
      },
    ],
    composition: {
      canContain: ["img", "video", "iframe"],
      canBeContainedBy: ["Card", "Grid", "Flex"],
    },
  },
  {
    name: "Card",
    category: "layout",
    description:
      "A container component for displaying content in a contained box with optional header and footer",
    useCases: [
      "displaying content in a contained box",
      "showing metrics or statistics",
      "grouping related information",
      "creating visual hierarchy",
    ],
    dataTypes: ["text", "tabular", "categorical", "numerical", "mixed"],
    subComponents: [
      "CardHeader",
      "CardTitle",
      "CardDescription",
      "CardContent",
      "CardFooter",
    ],
    keyProps: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes",
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["Grid", "Flex", "Container"],
    },
    styling: {
      variants: ["default", "bordered", "ghost"],
      themes: ["light", "dark"],
    },
  },
  {
    name: "Container",
    category: "layout",
    description:
      "A responsive container component that centers content and sets a max-width",
    useCases: [
      "page layouts",
      "content centering",
      "responsive containers",
      "section wrappers",
    ],
    dataTypes: ["mixed"],
    keyProps: [
      {
        name: "size",
        type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
        description: "The maximum width of the container",
        default: "lg",
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
  },
  {
    name: "Grid",
    category: "layout",
    description: "A responsive grid layout component",
    useCases: [
      "grid layouts",
      "responsive grids",
      "card grids",
      "image galleries",
    ],
    dataTypes: ["mixed"],
    keyProps: [
      {
        name: "cols",
        type: "number | { sm: number; md: number; lg: number }",
        description: "Number of columns at different breakpoints",
        default: { sm: 1, md: 2, lg: 3 },
      },
      {
        name: "gap",
        type: "number",
        description: "Gap between grid items",
        default: 4,
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["Container", "Section"],
    },
  },
  {
    name: "Tabs",
    category: "layout",
    description:
      "A set of layered sections of content, where only one section is visible at a time",
    useCases: [
      "organizing content into sections",
      "switching between different views",
      "reducing visual clutter",
      "grouping related content",
    ],
    dataTypes: ["mixed", "tabular", "categorical"],
    subComponents: ["TabsList", "TabsTrigger", "TabsContent"],
    keyProps: [
      {
        name: "defaultValue",
        type: "string",
        description:
          "The value of the tab that should be active when initially rendered",
      },
      {
        name: "value",
        type: "string",
        description: "The controlled value of the tab to activate",
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback fired when the value changes",
      },
    ],
    composition: {
      canContain: ["TabsList", "TabsContent"],
      canBeContainedBy: ["Card", "Dialog", "Sheet"],
    },
    accessibility: {
      ariaRole: "tablist",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },

  // Form Components
  {
    name: "Button",
    category: "form",
    description:
      "A button component that supports different variants and sizes",
    useCases: [
      "user actions",
      "form submissions",
      "navigation",
      "interactive elements",
    ],
    dataTypes: ["action"],
    keyProps: [
      {
        name: "variant",
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        description: "The visual style of the button",
        default: "default",
      },
      {
        name: "size",
        type: "'default' | 'sm' | 'lg' | 'icon'",
        description: "The size of the button",
        default: "default",
      },
      {
        name: "asChild",
        type: "boolean",
        description: "Whether to render as a child component",
        default: false,
      },
    ],
    composition: {
      canContain: ["Icon", "Text"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "button",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    styling: {
      variants: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      sizes: ["default", "sm", "lg", "icon"],
    },
  },
  {
    name: "Checkbox",
    category: "form",
    description: "A checkbox input component",
    useCases: [
      "boolean inputs",
      "multiple selection",
      "form fields",
      "toggle options",
    ],
    dataTypes: ["boolean"],
    keyProps: [
      {
        name: "checked",
        type: "boolean",
        description: "The checked state of the checkbox",
      },
      {
        name: "onCheckedChange",
        type: "function",
        description: "Callback when checked state changes",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the checkbox is disabled",
        default: false,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["FormField", "Label"],
    },
    accessibility: {
      ariaRole: "checkbox",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Input",
    category: "form",
    description: "A form input component with various types and states",
    useCases: ["text input", "form fields", "search inputs", "data entry"],
    dataTypes: ["text", "number", "email", "password"],
    keyProps: [
      {
        name: "type",
        type: "string",
        description: "The type of input (text, number, email, etc.)",
        default: "text",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text when input is empty",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the input is disabled",
        default: false,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["FormField", "Label"],
    },
    accessibility: {
      ariaRole: "textbox",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Select",
    category: "form",
    description: "A select component for choosing from a list of options",
    useCases: [
      "dropdown selection",
      "form fields",
      "option selection",
      "filtering",
    ],
    dataTypes: ["categorical"],
    subComponents: [
      "SelectTrigger",
      "SelectValue",
      "SelectContent",
      "SelectItem",
    ],
    keyProps: [
      {
        name: "value",
        type: "string",
        description: "The selected value",
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback when value changes",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the select is disabled",
        default: false,
      },
    ],
    composition: {
      canContain: ["SelectItem"],
      canBeContainedBy: ["FormField", "Label"],
    },
    accessibility: {
      ariaRole: "combobox",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Textarea",
    category: "form",
    description: "A multi-line text input component",
    useCases: ["long text input", "comments", "descriptions", "form fields"],
    dataTypes: ["text"],
    keyProps: [
      {
        name: "rows",
        type: "number",
        description: "Number of visible text lines",
        default: 3,
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text when textarea is empty",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the textarea is disabled",
        default: false,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["FormField", "Label"],
    },
    accessibility: {
      ariaRole: "textbox",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },

  // Data Display Components
  {
    name: "DataTable",
    category: "data-display",
    description:
      "A table component with built-in sorting, filtering, and pagination capabilities",
    useCases: [
      "displaying structured data",
      "sortable and filterable content",
      "tabular data presentation",
      "data exploration",
    ],
    dataTypes: ["tabular", "categorical", "numerical"],
    keyProps: [
      {
        name: "columns",
        type: "Column[]",
        description: "The columns configuration for the table",
        required: true,
      },
      {
        name: "data",
        type: "any[]",
        description: "The data to display in the table",
        required: true,
      },
      {
        name: "sorting",
        type: "SortingState",
        description: "The current sorting state of the table",
      },
      {
        name: "pagination",
        type: "PaginationState",
        description: "The current pagination state",
      },
    ],
    composition: {
      canContain: ["TableHeader", "TableBody", "TableFooter"],
      canBeContainedBy: ["Card", "Container"],
    },
    accessibility: {
      ariaRole: "grid",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Table",
    category: "data-display",
    description:
      "A basic table component for displaying data in rows and columns",
    useCases: [
      "simple data display",
      "tabular information",
      "comparative data",
      "structured content",
    ],
    dataTypes: ["tabular", "categorical", "numerical"],
    subComponents: [
      "TableHeader",
      "TableBody",
      "TableFooter",
      "TableRow",
      "TableHead",
      "TableCell",
    ],
    keyProps: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes",
      },
    ],
    composition: {
      canContain: ["TableHeader", "TableBody", "TableFooter"],
      canBeContainedBy: ["Card", "Container"],
    },
    accessibility: {
      ariaRole: "table",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },

  // Visualization Components
  {
    name: "LineChart",
    category: "visualization",
    description:
      "A chart component for displaying data points connected by lines, useful for showing trends over time",
    useCases: [
      "showing trends over time",
      "comparing multiple series",
      "visualizing continuous data",
      "tracking changes",
    ],
    dataTypes: ["numerical", "time-series"],
    keyProps: [
      {
        name: "data",
        type: "Array<{x: number|string, y: number}>",
        description: "The data points to plot",
        required: true,
      },
      {
        name: "xAxis",
        type: "object",
        description: "Configuration for the x-axis",
      },
      {
        name: "yAxis",
        type: "object",
        description: "Configuration for the y-axis",
      },
      {
        name: "showLegend",
        type: "boolean",
        description: "Whether to show the legend",
        default: true,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["Card", "Container"],
    },
    styling: {
      themes: ["light", "dark"],
    },
  },
  {
    name: "PieChart",
    category: "visualization",
    description:
      "A circular chart divided into sectors, showing numerical proportions",
    useCases: [
      "showing proportions of a whole",
      "comparing parts of a dataset",
      "displaying categorical distributions",
      "visualizing percentages",
    ],
    dataTypes: ["categorical", "numerical"],
    keyProps: [
      {
        name: "data",
        type: "Array<{label: string, value: number}>",
        description: "The data to display in the pie chart",
        required: true,
      },
      {
        name: "showLegend",
        type: "boolean",
        description: "Whether to show the legend",
        default: true,
      },
      {
        name: "colors",
        type: "string[]",
        description: "Custom colors for the pie segments",
      },
      {
        name: "innerRadius",
        type: "number",
        description: "Inner radius for donut chart (0 for pie chart)",
        default: 0,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["Card", "Container"],
    },
    styling: {
      themes: ["light", "dark"],
    },
  },
  {
    name: "BarChart",
    category: "visualization",
    description: "A chart with rectangular bars representing data values",
    useCases: [
      "comparing quantities across categories",
      "showing discrete data",
      "visualizing rankings",
      "displaying frequency distributions",
    ],
    dataTypes: ["categorical", "numerical"],
    keyProps: [
      {
        name: "data",
        type: "Array<{label: string, value: number}>",
        description: "The data to display in the bar chart",
        required: true,
      },
      {
        name: "orientation",
        type: "'vertical' | 'horizontal'",
        description: "The orientation of the bars",
        default: "vertical",
      },
      {
        name: "stacked",
        type: "boolean",
        description: "Whether to stack the bars",
        default: false,
      },
      {
        name: "showLegend",
        type: "boolean",
        description: "Whether to show the legend",
        default: true,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["Card", "Container"],
    },
    styling: {
      themes: ["light", "dark"],
    },
  },

  // Feedback Components
  {
    name: "Alert",
    category: "feedback",
    description: "A component for displaying important messages to users",
    useCases: [
      "showing important messages",
      "error notifications",
      "success messages",
      "warning alerts",
    ],
    dataTypes: ["text"],
    subComponents: ["AlertTitle", "AlertDescription"],
    keyProps: [
      {
        name: "variant",
        type: "'default' | 'destructive'",
        description: "The visual style of the alert",
        default: "default",
      },
    ],
    composition: {
      canContain: ["AlertTitle", "AlertDescription", "Icon"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "alert",
      screenReaderSupport: true,
    },
    styling: {
      variants: ["default", "destructive"],
    },
  },
  {
    name: "Dialog",
    category: "feedback",
    description: "A modal dialog component for important content",
    useCases: [
      "modal dialogs",
      "confirmation dialogs",
      "form dialogs",
      "content overlays",
    ],
    dataTypes: ["mixed"],
    subComponents: [
      "DialogTrigger",
      "DialogContent",
      "DialogHeader",
      "DialogFooter",
      "DialogTitle",
      "DialogDescription",
    ],
    keyProps: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the dialog is open",
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when open state changes",
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "dialog",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Toast",
    category: "feedback",
    description:
      "A non-disruptive message that appears at the bottom of the interface",
    useCases: [
      "temporary notifications",
      "action feedback",
      "status updates",
      "success/error messages",
    ],
    dataTypes: ["text"],
    keyProps: [
      {
        name: "title",
        type: "string",
        description: "The title of the toast",
      },
      {
        name: "description",
        type: "string",
        description: "The description of the toast",
      },
      {
        name: "duration",
        type: "number",
        description: "How long the toast should stay visible",
        default: 5000,
      },
      {
        name: "variant",
        type: "'default' | 'destructive'",
        description: "The visual style of the toast",
        default: "default",
      },
    ],
    composition: {
      canContain: ["Icon"],
      canBeContainedBy: ["ToastProvider"],
    },
    accessibility: {
      ariaRole: "status",
      screenReaderSupport: true,
    },
    styling: {
      variants: ["default", "destructive"],
    },
  },

  // Navigation Components
  {
    name: "NavigationMenu",
    category: "navigation",
    description: "A navigation menu component with support for dropdown menus",
    useCases: [
      "main navigation",
      "dropdown menus",
      "site navigation",
      "hierarchical navigation",
    ],
    dataTypes: ["navigation"],
    subComponents: [
      "NavigationMenuList",
      "NavigationMenuItem",
      "NavigationMenuTrigger",
      "NavigationMenuContent",
    ],
    keyProps: [
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        description: "The orientation of the navigation menu",
        default: "horizontal",
      },
    ],
    composition: {
      canContain: ["NavigationMenuItem"],
      canBeContainedBy: ["Header", "Container"],
    },
    accessibility: {
      ariaRole: "navigation",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Pagination",
    category: "navigation",
    description: "A component for navigating through paginated content",
    useCases: [
      "page navigation",
      "content pagination",
      "table pagination",
      "list pagination",
    ],
    dataTypes: ["navigation"],
    subComponents: [
      "PaginationContent",
      "PaginationItem",
      "PaginationLink",
      "PaginationNext",
      "PaginationPrevious",
    ],
    keyProps: [
      {
        name: "currentPage",
        type: "number",
        description: "The current page number",
        required: true,
      },
      {
        name: "totalPages",
        type: "number",
        description: "The total number of pages",
        required: true,
      },
      {
        name: "onPageChange",
        type: "function",
        description: "Callback when page changes",
      },
    ],
    composition: {
      canContain: ["PaginationItem"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "navigation",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },

  // Overlay Components
  {
    name: "AlertDialog",
    category: "overlay",
    description:
      "A modal dialog that interrupts the user with important content and expects a response",
    useCases: [
      "confirmation dialogs",
      "destructive actions",
      "important notifications",
      "user decisions",
    ],
    dataTypes: ["action", "text"],
    subComponents: [
      "AlertDialogTrigger",
      "AlertDialogContent",
      "AlertDialogHeader",
      "AlertDialogFooter",
      "AlertDialogTitle",
      "AlertDialogDescription",
      "AlertDialogAction",
      "AlertDialogCancel",
    ],
    keyProps: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the dialog is open",
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when open state changes",
      },
    ],
    composition: {
      canContain: ["AlertDialogContent"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "alertdialog",
      screenReaderSupport: true,
      focusTrap: true,
      ariaProps: {
        "aria-modal": "true",
        "aria-describedby": "dialog-description",
      },
    },
    state: {
      controlled: true,
      uncontrolled: true,
      defaultState: { open: false },
    },
    interactions: {
      focus: true,
    },
  },
  {
    name: "Dialog",
    category: "overlay",
    description: "A modal dialog component for important content",
    useCases: [
      "modal dialogs",
      "form dialogs",
      "content overlays",
      "modal forms",
    ],
    dataTypes: ["mixed"],
    subComponents: [
      "DialogTrigger",
      "DialogContent",
      "DialogHeader",
      "DialogFooter",
      "DialogTitle",
      "DialogDescription",
    ],
    keyProps: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the dialog is open",
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when open state changes",
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "dialog",
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusTrap: true,
    },
    state: {
      controlled: true,
      uncontrolled: true,
      defaultState: { open: false },
    },
  },
  {
    name: "Popover",
    category: "overlay",
    description: "A popup that appears in relation to an element",
    useCases: ["tooltips", "dropdowns", "context menus", "floating content"],
    dataTypes: ["mixed"],
    subComponents: ["PopoverTrigger", "PopoverContent", "PopoverClose"],
    keyProps: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the popover is open",
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when open state changes",
      },
      {
        name: "side",
        type: "'top' | 'right' | 'bottom' | 'left'",
        description: "The side of the trigger to show the popover",
        default: "bottom",
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "dialog",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    state: {
      controlled: true,
      uncontrolled: true,
      defaultState: { open: false },
    },
  },

  // Media Components
  {
    name: "Avatar",
    category: "media",
    description: "An image element with a fallback for representing the user",
    useCases: [
      "user avatars",
      "profile pictures",
      "user representation",
      "team members",
    ],
    dataTypes: ["image", "text"],
    subComponents: ["AvatarImage", "AvatarFallback"],
    keyProps: [
      {
        name: "src",
        type: "string",
        description: "The source URL of the avatar image",
      },
      {
        name: "alt",
        type: "string",
        description: "Alternative text for the avatar image",
        required: true,
      },
      {
        name: "fallback",
        type: "string",
        description: "Text to show when image fails to load",
      },
    ],
    composition: {
      canContain: ["AvatarImage", "AvatarFallback"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "img",
      screenReaderSupport: true,
    },
    styling: {
      sizes: ["sm", "md", "lg"],
      variants: ["default", "rounded"],
      responsive: true,
    },
  },
  {
    name: "AspectRatio",
    category: "media",
    description: "A component that maintains a consistent width/height ratio",
    useCases: [
      "responsive images",
      "video containers",
      "maintaining proportions",
      "consistent layouts",
    ],
    dataTypes: ["media", "mixed"],
    keyProps: [
      {
        name: "ratio",
        type: "number",
        description: "The width/height ratio (e.g., 16/9 = 1.777)",
        required: true,
        validation: {
          min: 0.1,
          max: 10,
        },
      },
    ],
    composition: {
      canContain: ["img", "video", "iframe"],
      canBeContainedBy: ["Card", "Grid", "Flex"],
    },
    styling: {
      responsive: true,
    },
  },

  // Interaction Components
  {
    name: "HoverCard",
    category: "interaction",
    description: "A card that appears when hovering over an element",
    useCases: [
      "additional information",
      "preview content",
      "tooltips",
      "contextual help",
    ],
    dataTypes: ["mixed"],
    subComponents: ["HoverCardTrigger", "HoverCardContent"],
    keyProps: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the hover card is open",
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when open state changes",
      },
      {
        name: "openDelay",
        type: "number",
        description: "Delay in ms before opening",
        default: 200,
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "tooltip",
      screenReaderSupport: true,
    },
    interactions: {
      hover: true,
    },
    state: {
      controlled: true,
      uncontrolled: true,
      defaultState: { open: false },
    },
  },
  {
    name: "Tooltip",
    category: "interaction",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it",
    useCases: [
      "additional information",
      "contextual help",
      "feature explanations",
      "short descriptions",
    ],
    dataTypes: ["text"],
    subComponents: ["TooltipTrigger", "TooltipContent", "TooltipProvider"],
    keyProps: [
      {
        name: "content",
        type: "string",
        description: "The content to show in the tooltip",
        required: true,
      },
      {
        name: "side",
        type: "'top' | 'right' | 'bottom' | 'left'",
        description: "The side of the trigger to show the tooltip",
        default: "top",
      },
      {
        name: "delayDuration",
        type: "number",
        description: "Delay in ms before showing the tooltip",
        default: 200,
      },
    ],
    composition: {
      canContain: ["TooltipContent"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "tooltip",
      screenReaderSupport: true,
    },
    interactions: {
      hover: true,
      focus: true,
    },
  },

  // Form Components (Additional)
  {
    name: "RadioGroup",
    category: "form",
    description:
      "A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time",
    useCases: ["single selection", "option groups", "form fields", "settings"],
    dataTypes: ["categorical"],
    subComponents: ["RadioGroupItem", "RadioGroupLabel"],
    keyProps: [
      {
        name: "value",
        type: "string",
        description: "The value of the selected radio button",
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback when value changes",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the radio group is disabled",
        default: false,
      },
    ],
    composition: {
      canContain: ["RadioGroupItem"],
      canBeContainedBy: ["FormField", "Label"],
    },
    accessibility: {
      ariaRole: "radiogroup",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Switch",
    category: "form",
    description:
      "A control that allows the user to toggle between checked and not checked",
    useCases: ["boolean toggles", "settings", "feature flags", "on/off states"],
    dataTypes: ["boolean"],
    keyProps: [
      {
        name: "checked",
        type: "boolean",
        description: "The checked state of the switch",
      },
      {
        name: "onCheckedChange",
        type: "function",
        description: "Callback when checked state changes",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the switch is disabled",
        default: false,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["FormField", "Label"],
    },
    accessibility: {
      ariaRole: "switch",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    styling: {
      variants: ["default", "outline"],
      sizes: ["default", "sm", "lg"],
    },
  },

  // Layout Components (Additional)
  {
    name: "ScrollArea",
    category: "layout",
    description: "A custom scrollable container that can be themed and styled",
    useCases: [
      "scrollable content",
      "custom scrollbars",
      "overflow content",
      "scrollable containers",
    ],
    dataTypes: ["mixed"],
    keyProps: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes",
      },
      {
        name: "type",
        type: "'always' | 'auto' | 'hover' | 'scroll'",
        description: "When to show the scrollbar",
        default: "hover",
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
    styling: {
      variants: ["default", "minimal"],
      customStyles: ["scrollbar-thin", "scrollbar-thumb"],
    },
    performance: {
      virtualization: true,
    },
  },
  {
    name: "Separator",
    category: "layout",
    description: "A visual separator between content",
    useCases: [
      "dividing content",
      "visual hierarchy",
      "section separation",
      "list items",
    ],
    dataTypes: ["visual"],
    keyProps: [
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        description: "The orientation of the separator",
        default: "horizontal",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes",
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["*"],
    },
    styling: {
      variants: ["default", "dashed"],
    },
  },

  // Data Display Components (Additional)
  {
    name: "Badge",
    category: "data-display",
    description:
      "A small badge component for displaying status, counts, or labels",
    useCases: ["status indicators", "count badges", "labels", "tags"],
    dataTypes: ["text", "categorical"],
    keyProps: [
      {
        name: "variant",
        type: "'default' | 'secondary' | 'destructive' | 'outline'",
        description: "The visual style of the badge",
        default: "default",
      },
      {
        name: "size",
        type: "'default' | 'sm' | 'lg'",
        description: "The size of the badge",
        default: "default",
      },
    ],
    composition: {
      canContain: ["Icon"],
      canBeContainedBy: ["*"],
    },
    styling: {
      variants: ["default", "secondary", "destructive", "outline"],
      sizes: ["default", "sm", "lg"],
    },
  },
  {
    name: "Calendar",
    category: "data-display",
    description: "A calendar component for date selection and display",
    useCases: ["date selection", "date display", "date ranges", "scheduling"],
    dataTypes: ["date", "date-range"],
    subComponents: ["CalendarHeader", "CalendarGrid", "CalendarCell"],
    keyProps: [
      {
        name: "mode",
        type: "'single' | 'range' | 'multiple'",
        description: "The selection mode of the calendar",
        default: "single",
      },
      {
        name: "selected",
        type: "Date | Date[] | { from: Date; to: Date }",
        description: "The selected date(s)",
      },
      {
        name: "onSelect",
        type: "function",
        description: "Callback when date selection changes",
      },
      {
        name: "disabled",
        type: "Date[]",
        description: "Dates that should be disabled",
      },
    ],
    composition: {
      canContain: ["CalendarHeader", "CalendarGrid"],
      canBeContainedBy: ["Popover", "Dialog", "Card"],
    },
    accessibility: {
      ariaRole: "grid",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    state: {
      controlled: true,
      uncontrolled: true,
    },
  },
  {
    name: "Carousel",
    category: "data-display",
    description:
      "A carousel component for displaying a set of items in a scrollable container",
    useCases: [
      "image galleries",
      "featured content",
      "testimonials",
      "product showcases",
    ],
    dataTypes: ["media", "mixed"],
    subComponents: [
      "CarouselContent",
      "CarouselItem",
      "CarouselNext",
      "CarouselPrevious",
    ],
    keyProps: [
      {
        name: "opts",
        type: "object",
        description: "Carousel options like loop, autoplay, etc.",
      },
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        description: "The orientation of the carousel",
        default: "horizontal",
      },
    ],
    composition: {
      canContain: ["CarouselItem"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "region",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    interactions: {
      dragAndDrop: true,
    },
  },
  {
    name: "Command",
    category: "data-display",
    description: "A command palette component for quick actions and navigation",
    useCases: [
      "command palette",
      "quick actions",
      "search interface",
      "keyboard navigation",
    ],
    dataTypes: ["action", "navigation"],
    subComponents: [
      "CommandDialog",
      "CommandInput",
      "CommandList",
      "CommandEmpty",
      "CommandGroup",
      "CommandItem",
      "CommandSeparator",
      "CommandShortcut",
    ],
    keyProps: [
      {
        name: "shouldFilter",
        type: "boolean",
        description: "Whether to filter items based on input",
        default: true,
      },
      {
        name: "filter",
        type: "function",
        description: "Custom filter function",
      },
    ],
    composition: {
      canContain: ["CommandItem", "CommandGroup"],
      canBeContainedBy: ["Dialog", "Popover"],
    },
    accessibility: {
      ariaRole: "combobox",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    interactions: {
      focus: true,
    },
  },
  {
    name: "ContextMenu",
    category: "data-display",
    description: "A context menu component that appears on right-click",
    useCases: [
      "right-click menus",
      "contextual actions",
      "quick actions",
      "context-sensitive options",
    ],
    dataTypes: ["action"],
    subComponents: [
      "ContextMenuTrigger",
      "ContextMenuContent",
      "ContextMenuItem",
      "ContextMenuCheckboxItem",
      "ContextMenuRadioItem",
      "ContextMenuLabel",
      "ContextMenuSeparator",
      "ContextMenuShortcut",
      "ContextMenuGroup",
      "ContextMenuPortal",
      "ContextMenuSub",
      "ContextMenuSubContent",
      "ContextMenuSubTrigger",
      "ContextMenuRadioGroup",
    ],
    keyProps: [
      {
        name: "modal",
        type: "boolean",
        description: "Whether the menu is modal",
        default: false,
      },
    ],
    composition: {
      canContain: ["ContextMenuItem", "ContextMenuGroup"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "menu",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "DropdownMenu",
    category: "data-display",
    description:
      "A dropdown menu component for displaying a list of actions or options",
    useCases: [
      "action menus",
      "option lists",
      "navigation menus",
      "context menus",
    ],
    dataTypes: ["action", "navigation"],
    subComponents: [
      "DropdownMenuTrigger",
      "DropdownMenuContent",
      "DropdownMenuItem",
      "DropdownMenuCheckboxItem",
      "DropdownMenuRadioItem",
      "DropdownMenuLabel",
      "DropdownMenuSeparator",
      "DropdownMenuShortcut",
      "DropdownMenuGroup",
      "DropdownMenuPortal",
      "DropdownMenuSub",
      "DropdownMenuSubContent",
      "DropdownMenuSubTrigger",
      "DropdownMenuRadioGroup",
    ],
    keyProps: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the menu is open",
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when open state changes",
      },
    ],
    composition: {
      canContain: ["DropdownMenuItem", "DropdownMenuGroup"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "menu",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    state: {
      controlled: true,
      uncontrolled: true,
      defaultState: { open: false },
    },
  },

  // Form Components (Additional)
  {
    name: "Label",
    category: "form",
    description: "A label component for form controls",
    useCases: [
      "form labels",
      "input labels",
      "control labels",
      "accessibility labels",
    ],
    dataTypes: ["text"],
    keyProps: [
      {
        name: "htmlFor",
        type: "string",
        description: "The id of the form control the label is for",
      },
    ],
    composition: {
      canContain: ["Text"],
      canBeContainedBy: ["FormField"],
    },
    accessibility: {
      ariaRole: "label",
      screenReaderSupport: true,
    },
  },
  {
    name: "Menubar",
    category: "form",
    description:
      "A menubar component for displaying a horizontal list of menu items",
    useCases: [
      "application menus",
      "navigation menus",
      "toolbar menus",
      "context menus",
    ],
    dataTypes: ["navigation", "action"],
    subComponents: [
      "MenubarMenu",
      "MenubarTrigger",
      "MenubarContent",
      "MenubarItem",
      "MenubarSeparator",
      "MenubarLabel",
      "MenubarCheckboxItem",
      "MenubarRadioItem",
      "MenubarPortal",
      "MenubarSub",
      "MenubarSubContent",
      "MenubarSubTrigger",
      "MenubarGroup",
      "MenubarRadioGroup",
      "MenubarShortcut",
    ],
    keyProps: [
      {
        name: "loop",
        type: "boolean",
        description: "Whether to loop through menu items",
        default: true,
      },
    ],
    composition: {
      canContain: ["MenubarMenu"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "menubar",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: "Progress",
    category: "form",
    description: "A progress component for displaying the progress of a task",
    useCases: [
      "loading states",
      "progress indicators",
      "task progress",
      "upload progress",
    ],
    dataTypes: ["number"],
    keyProps: [
      {
        name: "value",
        type: "number",
        description: "The current progress value",
        validation: {
          min: 0,
          max: 100,
        },
      },
      {
        name: "max",
        type: "number",
        description: "The maximum progress value",
        default: 100,
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "progressbar",
      screenReaderSupport: true,
    },
    styling: {
      variants: ["default", "indeterminate"],
    },
  },
  {
    name: "Resizable",
    category: "form",
    description:
      "A resizable component for creating resizable panels and containers",
    useCases: [
      "resizable panels",
      "split views",
      "adjustable containers",
      "custom layouts",
    ],
    dataTypes: ["mixed"],
    subComponents: ["ResizablePanel", "ResizableHandle"],
    keyProps: [
      {
        name: "defaultSize",
        type: "number",
        description: "The default size of the panel",
        default: 50,
      },
      {
        name: "minSize",
        type: "number",
        description: "The minimum size of the panel",
        default: 10,
      },
      {
        name: "maxSize",
        type: "number",
        description: "The maximum size of the panel",
        default: 90,
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
    interactions: {
      resizable: true,
    },
  },
  {
    name: "Sheet",
    category: "form",
    description: "A sheet component that slides in from the edge of the screen",
    useCases: ["side panels", "drawers", "mobile menus", "slide-out content"],
    dataTypes: ["mixed"],
    subComponents: [
      "SheetTrigger",
      "SheetContent",
      "SheetHeader",
      "SheetFooter",
      "SheetTitle",
      "SheetDescription",
    ],
    keyProps: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the sheet is open",
      },
      {
        name: "onOpenChange",
        type: "function",
        description: "Callback when open state changes",
      },
      {
        name: "side",
        type: "'top' | 'right' | 'bottom' | 'left'",
        description: "The side of the screen to slide in from",
        default: "right",
      },
    ],
    composition: {
      canContain: ["*"],
      canBeContainedBy: ["*"],
    },
    accessibility: {
      ariaRole: "dialog",
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusTrap: true,
    },
    state: {
      controlled: true,
      uncontrolled: true,
      defaultState: { open: false },
    },
  },
  {
    name: "Skeleton",
    category: "form",
    description: "A skeleton component for loading states",
    useCases: [
      "loading states",
      "content placeholders",
      "loading indicators",
      "progressive loading",
    ],
    dataTypes: ["visual"],
    keyProps: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes",
      },
    ],
    composition: {
      canContain: [],
      canBeContainedBy: ["*"],
    },
    styling: {
      variants: ["default", "pulse"],
    },
  },
  {
    name: "Slider",
    category: "form",
    description: "A slider component for selecting a value within a range",
    useCases: [
      "range selection",
      "value adjustment",
      "volume controls",
      "progress controls",
    ],
    dataTypes: ["number"],
    subComponents: ["SliderTrack", "SliderRange", "SliderThumb"],
    keyProps: [
      {
        name: "value",
        type: "number | number[]",
        description: "The current value of the slider",
      },
      {
        name: "onValueChange",
        type: "function",
        description: "Callback when value changes",
      },
      {
        name: "min",
        type: "number",
        description: "The minimum value",
        default: 0,
      },
      {
        name: "max",
        type: "number",
        description: "The maximum value",
        default: 100,
      },
      {
        name: "step",
        type: "number",
        description: "The step increment",
        default: 1,
      },
    ],
    composition: {
      canContain: ["SliderTrack", "SliderRange", "SliderThumb"],
      canBeContainedBy: ["FormField", "Label"],
    },
    accessibility: {
      ariaRole: "slider",
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
    interactions: {
      dragAndDrop: true,
    },
  },
];

// Helper function to get components by category
export function getComponentsByCategory(
  category: ComponentCapability["category"]
) {
  return componentRegistry.filter(
    (component) => component.category === category
  );
}

// Helper function to get components by data type
export function getComponentsByDataType(dataType: string) {
  return componentRegistry.filter((component) =>
    component.dataTypes.includes(dataType)
  );
}

// Helper function to get components by use case
export function getComponentsByUseCase(useCase: string) {
  return componentRegistry.filter((component) =>
    component.useCases.some((uc) =>
      uc.toLowerCase().includes(useCase.toLowerCase())
    )
  );
}

// Helper function to get components by name
export function getComponentByName(name: string) {
  return componentRegistry.find(
    (component) => component.name.toLowerCase() === name.toLowerCase()
  );
}

// Helper function to get all subcomponents
export function getSubComponents(componentName: string) {
  const component = getComponentByName(componentName);
  return component?.subComponents || [];
}

// Helper function to get components that can contain a specific component
export function getComponentsThatCanContain(componentName: string) {
  return componentRegistry.filter((component) =>
    component.composition?.canContain.includes(componentName)
  );
}

// Helper function to get components that can be contained by a specific component
export function getComponentsThatCanBeContainedBy(componentName: string) {
  return componentRegistry.filter((component) =>
    component.composition?.canBeContainedBy.includes(componentName)
  );
}

// Helper function to get components by accessibility role
export function getComponentsByAriaRole(role: string) {
  return componentRegistry.filter(
    (component) => component.accessibility?.ariaRole === role
  );
}

// Helper function to get components by styling variant
export function getComponentsByVariant(variant: string) {
  return componentRegistry.filter((component) =>
    component.styling?.variants?.includes(variant)
  );
}

// Additional helper functions for new metadata
export function getComponentsByInteraction(
  interaction: keyof ComponentCapability["interactions"]
) {
  return componentRegistry.filter(
    (component) => component.interactions?.[interaction]
  );
}

export function getComponentsByState(
  state: keyof ComponentCapability["state"]
) {
  return componentRegistry.filter((component) => component.state?.[state]);
}

export function getComponentsByEvent(
  event: keyof ComponentCapability["events"]
) {
  return componentRegistry.filter((component) => component.events?.[event]);
}

export function getComponentsByPerformance(
  feature: keyof ComponentCapability["performance"]
) {
  return componentRegistry.filter(
    (component) => component.performance?.[feature]
  );
}

export function getComponentsByValidation(
  validationType: keyof ComponentCapability["keyProps"][0]["validation"]
) {
  return componentRegistry.filter((component) =>
    component.keyProps.some((prop) => prop.validation?.[validationType])
  );
}

export function getComponentsByAccessibility(
  feature: keyof ComponentCapability["accessibility"]
) {
  return componentRegistry.filter(
    (component) => component.accessibility?.[feature]
  );
}

export function getComponentsByStyling(
  feature: keyof ComponentCapability["styling"]
) {
  return componentRegistry.filter((component) => component.styling?.[feature]);
}

export function getComponentsByComposition(
  compositionType: keyof ComponentCapability["composition"]
) {
  return componentRegistry.filter(
    (component) => component.composition?.[compositionType]
  );
}
